import { CircularProgress } from "@mui/material";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { AppAlert, AppAlertType } from "../components/AppAlert";
import { CompleteImport } from "../components/CompleteImport";
import { UploadCsv } from "../components/UploadCsv";
import { AppConstants } from "../config/AppConstants";
import { initialLoad } from "../features/data/dataSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { CsvItemDfo } from "../objects/InventoryItem";
import { ItemRepository } from "../repositories/ItemRepository";

export enum ImportError {
  none = "none",
  missingColumns = `
  Some columns are missing from your CSV.
  Please add the following columns: 
  `,
  success = "success",
}

export enum ImportState {
  initial,
  loading,
  complete,
  uploadError,
}

export class ColumnCsvMatch {
  appColumn: string;
  csvColumn?: string;

  constructor(appColumn: string, csvColumn?: string) {
    this.appColumn = appColumn;
    this.csvColumn = csvColumn;
  }
}

function getCsvColumns(csvColumns: { data: string[][] }): string[] {
  return csvColumns.data[0].map((c) => c.toLowerCase());
}

export function ImportPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState<ImportState>(ImportState.initial);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [error, setError] = useState<ImportError>(ImportError.none);

  function findMatches(csvColumns: string[]): ColumnCsvMatch[] {
    const match: ColumnCsvMatch[] = [];
    const lcColumns = AppConstants.columns;

    for (const column of lcColumns) {
      const index = csvColumns
        .map((c) => c.toLowerCase().replace("_", ""))
        .indexOf(column.name.toLowerCase().replace("_", ""));

      if (column.required) {
        if (index > -1) {
          match.push(new ColumnCsvMatch(column.name, csvColumns[index]));
        } else {
          match.push(new ColumnCsvMatch(column.name, undefined));
        }
      }
    }

    return match;
  }

  function uploadCallback(data: { data: string[][] }) {
    setCsvData(data.data);
    const csvColumns = getCsvColumns(data);
    setCsvColumns(csvColumns);
    const result = findMatches(csvColumns);
    const success = result.filter((m) => !m.csvColumn).length === 0;

    if (success) {
      // All columns were found.
      setError(ImportError.success);
    } else {
      // Some columns are missing.
      setMissingColumns(
        result.filter((m) => !m.csvColumn).map((e) => e.appColumn)
      );
      setError(ImportError.missingColumns);
    }
  }

  async function uploadItems() {
    setState(ImportState.loading);

    const dfos: CsvItemDfo[] = [];

    const indices: Map<string, number> = new Map();

    for (const c of AppConstants.columns.map((tc) =>
      tc.name.toLowerCase().replace("_", "")
    )) {
      const index = csvColumns.indexOf(c);
      indices.set(c, index);
    }

    const data = [...csvData];
    data.splice(0, 1);

    for (const d of data) {
      const dfo = new Map();

      for (const appColumn of AppConstants.columns.map((tc) => tc.name)) {
        const csvCol: string =
          d[indices.get(appColumn.toLowerCase().replace("_", "")) as number];
        dfo.set(appColumn, csvCol);
      }

      dfos.push(Object.fromEntries(dfo) as CsvItemDfo);
    }

    const success = await ItemRepository.createItemsList(dfos);

    if (success) {
      dispatch(initialLoad());
      setState(ImportState.complete);
    } else {
      setState(ImportState.uploadError);
    }
  }

  function renderPage(): ReactNode {
    switch (state) {
      case ImportState.initial:
        return (
          <UploadCsv
            callback={uploadCallback}
            missingColumns={missingColumns}
            error={error}
            upload={uploadItems}
          />
        );
      case ImportState.loading:
        return (
          <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
            <CircularProgress />
          </div>
        );
      case ImportState.uploadError:
        return (
          <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
            <AppAlert
              message="There was an error importing inventory items. Please try again."
              type={AppAlertType.error}
            />
          </div>
        );
      case ImportState.complete:
        return <CompleteImport />;
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col">
      <div className="flex flex-row items-center p-8">
        <div
          className="flex flex-row cursor-pointer items-center"
          onClick={() => navigate("/")}
        >
          <img className="h-3 mr-2" src={ImageHelper.image(Images.backBlue)} />
          <span className="text-light_purple font-medium text-sm">
            Back to OneStudio
          </span>
        </div>
      </div>
      <div className="flex flex-col ml-16">
        <span className="text-dark_blue font-semibold text-[30px]">
          Import CSV
        </span>
        <span className="text-dark_blue">
          Import your studio inventory from a CSV file.
        </span>
      </div>
      <div className="grow flex flex-col items-center justify-center">
        {renderPage()}
      </div>
    </div>
  );
}
