import { Divider, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { Analytics } from "../components/Analytics";
import { ItemStatus } from "../objects/InventoryItem";
import "./DashboardPage.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const user = useAppSelector((state) => state.data.user);
  const data = useAppSelector((state) => state.data);
  const navigate = useNavigate();

  return (
    <div className="dashboard__wrapper">
      <Typography variant="h5" fontWeight="bold" mb={5}>
        Hey, {user?.firstName ?? ""}!
      </Typography>
      <div className="dashboard__row">
        <Paper
          sx={{ height: "7em", width: "15em", marginRight: "2em" }}
          elevation={3}
          className="dashboard__card-wrapper"
        >
          <Typography fontSize={18}>
            {data.items.length} inventory items
          </Typography>
        </Paper>
        <Paper
          sx={{ height: "7em", width: "15em", marginRight: "2em" }}
          elevation={3}
          className="dashboard__card-wrapper"
        >
          <Typography fontSize={18}>
            {data.items.filter((i) => i.status === ItemStatus.faulty).length}{" "}
            faulty items
          </Typography>
        </Paper>
        <Paper
          sx={{ height: "7em", width: "15em", marginRight: "3em" }}
          elevation={3}
          className="dashboard__card-wrapper"
        >
          <Typography fontSize={18}>
            {data.items.filter((i) => i.status === ItemStatus.working).length}{" "}
            items working
          </Typography>
        </Paper>
        <div
          onClick={() => navigate("/inventory")}
          className="dashboard__go-card"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </div>
      </div>
      <Divider sx={{ width: "100%", marginTop: "4em", marginBottom: "4em" }} />
      {/* <Analytics /> */}
    </div>
  );
}
