import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAppSelector } from "../app/hooks";
import { ItemStatus } from "../objects/InventoryItem";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart() {
  const items = useAppSelector((state) => state.data.items);
  const chartData = {
    labels: ["Faulty", "Working"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          items.filter((i) => i.status === ItemStatus.faulty).length,
          items.filter((i) => i.status === ItemStatus.working).length,
        ],
        backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(53,49,255, 1)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(53,49,255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "25%", height: "25%" }}>
      <Doughnut data={chartData} />
    </div>
  );
}
