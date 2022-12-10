import { Chart as ChartJS } from "chart.js";
import { Line } from "react-chartjs-2";
import { registerables } from "chart.js";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ApiHelper } from "../helpers/ApiHelper";
import moment from "moment";
import { Logger } from "../services/logger";

ChartJS.register(...registerables);

interface Stat {
  id: number;
  item_id: number;
  type: string;
  notes: string;
  created_at: string;
  date: string;
}

function getDates(days: "l7d" | "l30d" | "all"): Array<string> {
  let daysAgo: any = {};
  const datesPeriod = days === "l7d" ? 6 : days === "l30d" ? 29 : 0;
  for (var i = 0; i <= datesPeriod; i++) {
    daysAgo[i] = moment().subtract(i, "days").format("DD/MM/YYYY");
  }

  return Object.keys(daysAgo)
    .map(function (key) {
      return daysAgo[key];
    })
    .reverse();
}

function getPoints(dates: Array<string>, stats: Array<Stat>): Array<number> {
  if (!dates || !stats) return [];

  let points: Array<number> = [];

  for (const date of dates) {
    const statsOnDate = stats.filter((s) => s.date === date).length;
    points.push(statsOnDate);
  }

  return points;
}

export function LineChart() {
  const [period, setPeriod] = useState<"l7d" | "l30d" | "all">("l7d");
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Array<Stat>>([]);
  const [points, setPoints] = useState<Array<number>>([]);

  async function _loadStats() {
    Logger.log("retrieving stats for period", period);
    setLoading(true);
    const s = await ApiHelper.getStats(period ?? "l7d", "fault");
    setStats(s.data);
    setPoints(getPoints(getDates(period), stats));
    setLoading(false);
  }

  useEffect(() => {
    _loadStats();
  }, []);

  const data = {
    labels: getDates(period),
    datasets: [
      {
        axis: "y",
        label: "Reported Issues",
        data: getPoints(getDates(period), stats),
        fill: false,
        backgroundColor: ["rgba(255, 99, 132, 1)"],
        borderColor: ["rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      style={{
        height: "25%",
        width: "45%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <FormControl sx={{ marginBottom: "1em", width: "20em" }} fullWidth>
            <InputLabel>Period</InputLabel>
            <Select
              value={period || "l7d"}
              size="small"
              label="Period"
              onChange={(event) => {
                setPeriod(event.target.value as "l7d" | "l30d" | "all");
                _loadStats();
              }}
            >
              <MenuItem value={"l7d"}>Last 7 days</MenuItem>
              <MenuItem value={"l30d"}>Last 30 days</MenuItem>
              <MenuItem value={"all"}>All time</MenuItem>
            </Select>
          </FormControl>
          <Line data={data} />
        </>
      )}
    </div>
  );
}
