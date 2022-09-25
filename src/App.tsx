import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initialLoad } from "./features/data/dataSlice";
import { ApiHelper } from "./helpers/ApiHelper";
import { InventoryPage } from "./pages/InventoryPage";
import { ItemPage } from "./pages/ItemPage";
import { LoginPage } from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import { SettingsPage } from "./pages/SettingsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { Importer } from "./pages/Importer";
import { ResetPassword } from "./pages/ResetPassword";
import { Constants } from "./utils/Constants";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.data.loading);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loadedLogin, setLoadedLogin] = useState<boolean>(false);

  let theme = createTheme({
    palette: {
      primary: {
        main: "#120F9C",
      },
      secondary: {
        main: "#edf2ff",
      },
    },
  });

  useEffect(() => {
    const baseUrl = location.pathname.replaceAll("/", "");
    console.log("baseurl", baseUrl);
    sessionStorage.setItem("url", window.location.href);

    ApiHelper.checkToken().then((value) => {
      setLoggedIn(value);
      if (value) {
        dispatch(initialLoad());
        setLoadedLogin(true);
      } else {
        ApiHelper.refreshToken().then((result) => {
          setLoggedIn(result);
          if (!result && !Constants.allowedRoutes.includes(baseUrl)) {
            navigate("/login");
            setLoadedLogin(true);
          } else {
            dispatch(initialLoad());
            setLoadedLogin(true);
          }
        });
      }
    });
    return () => {};
  }, []);

  if (!loadedLogin) return <div></div>;

  if (loading && loggedIn) {
    return <div></div>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          {loggedIn ? <Sidebar /> : <></>}
          <div style={{ width: loggedIn ? "calc(100vw - 6em)" : "100vw" }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/:id" element={<ItemPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/inventory/import" element={<Importer />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}
