import {
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "./Importer.css";
import Papa from "papaparse";
import { columns } from "../components/InventoryTable";

export function Importer() {
  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState<Array<string>>([]);
  const [values, setValues] = useState([]);
  const [uploaded, setUploaded] = useState(false);

  const changeHandler = (event: any) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const rowsArray: any = [];
        const valuesArray: any = [];

        // Iterating data to get column name and their values
        results.data.map((d: any) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);

        setUploaded(true);
      },
    });
  };

  function checkColumns(): { success: boolean; missing: Array<string> } {
    let check: boolean = true;
    let missing: Array<string> = [];
    const _columns = columns;

    for (const column of _columns) {
      if (
        !tableRows
          .map((v) => v.toLowerCase())
          .includes(column.label.toLowerCase()) &&
        column.id !== "notes" &&
        column.id !== "chk" &&
        column.id !== "status"
      ) {
        missing.push(column.label);
        check = false;
      }
    }

    return { success: check, missing: missing };
  }

  return (
    <div className="importer__wrapper">
      <div className="importer__padding">
        <div className="importer__col">
          <Typography mb={1}>
            <strong>1. </strong>Upload a CSV file.
          </Typography>
          <Button
            size="small"
            sx={{ width: "15em" }}
            variant="outlined"
            component="label"
          >
            Upload .csv file
            <input accept=".csv" type="file" hidden onChange={changeHandler} />
          </Button>
        </div>
        {uploaded ? (
          <>
            <div className="importer__col">
              <Typography mb={1}>
                <strong>2. </strong>I have found results that look like the
                following:
              </Typography>
              <TableContainer component={Paper} sx={{ width: "50%" }}>
                <Table size="small" aria-label="csv results">
                  <TableHead>
                    <TableRow>
                      {tableRows.map((tr) => (
                        <TableCell>{tr}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.slice(0, 5).map((row: Array<string>) => (
                      <TableRow
                        key={JSON.stringify(row)}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {row.map((v) => (
                          <TableCell component="th" scope="row">
                            {v}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {values.length > 5 ? (
                <Typography fontSize="small" mt={2}>
                  ...and another {values.length - 5} rows.
                </Typography>
              ) : (
                <></>
              )}
            </div>
            <div className="importer__col">
              <Typography mb={4}>
                <strong>3. </strong>
                {checkColumns().success
                  ? "I have found all required columns."
                  : `The following required columns are missing in your CSV file: ${checkColumns().missing.join(
                      ", "
                    )}. Please edit your CSV as required and re-upload it.`}
              </Typography>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
