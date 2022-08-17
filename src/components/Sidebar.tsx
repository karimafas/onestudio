import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import BentoIcon from "@mui/icons-material/Bento";
import { Link, useLocation } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    ></div>
  );
}

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
        <Link to={"/"} style={{ color: "#186BCC" }}>
          <Tab icon={<HomeIcon />} />
        </Link>
        <Link style={{ color: "#186BCC" }} to={"/inventory"}>
          <Tab icon={<BentoIcon />} />
        </Link>
        <Link style={{ color: "#186BCC" }} to={"/settings"}>
          <Tab icon={<SettingsIcon />} />
        </Link>
      </Tabs>
      <TabPanel value={value} index={0}>
        Dashboard
      </TabPanel>
    </Box>
  );
}
