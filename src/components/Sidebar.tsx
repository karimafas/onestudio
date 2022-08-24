import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import BentoIcon from "@mui/icons-material/Bento";
import { useLocation, useNavigate } from "react-router-dom";

function getTab(path: string): number {
  if (path.startsWith("dashboard")) {
    return 0;
  } else if (path.startsWith("inventory")) {
    return 1;
  } else if (path.startsWith("settings")) {
    return 2;
  }

  return 0;
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/inventory");
        break;
      case 2:
        navigate("/settings");
        break;
    }
  };

  const pathLocation = useLocation();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        height: "100vh",
        width: "6em",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={getTab(pathLocation.pathname.replace("/", ""))}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab icon={<HomeIcon />} />
        <Tab icon={<BentoIcon />} />
        <Tab icon={<SettingsIcon />} />
      </Tabs>
    </Box>
  );
}
