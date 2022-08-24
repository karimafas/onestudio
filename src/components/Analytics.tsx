import "./Analytics.css";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";

export function Analytics() {
  return (
    <div className="analytics__wrapper">
      <PieChart />
      <LineChart />
    </div>
  );
}
