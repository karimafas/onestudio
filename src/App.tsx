import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initialLoad } from "./features/data/dataSlice";
import { InventoryPage } from "./pages/InventoryPage";
import { ItemPage } from "./pages/ItemPage";
import { LoginPage } from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import { SettingsPage } from "./pages/SettingsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { AppBackground } from "./components/AppBackground";
import { AuthRepository } from "./repositories/AuthRepository";

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

  function logout() {
    setLoggedIn(false);
    navigate("/login");
    setLoadedLogin(true);
  }

  function login() {
    setLoadedLogin(true);
    setLoggedIn(true);
    dispatch(initialLoad());
  }

  useEffect(() => {
    sessionStorage.setItem("url", window.location.href);
    const refreshToken = true;

    if (refreshToken) {
      AuthRepository.refreshToken().then((success) => {
        if (success) {
          login();
        } else {
          logout();
        }
      });
    } else {
      logout();
    }

    return () => {};
  }, []);

  if (!loadedLogin) return <div></div>;

  if (loading && loggedIn) {
    return <div></div>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBackground />
          <div className="relative mt-[-100vh] flex flex-row overflow-hidden">
            <div>{loggedIn ? <Sidebar /> : <></>}</div>
            <div
              style={{
                width: loggedIn ? "calc(100vw - 15em)" : "100vw",
              }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/:id" element={<ItemPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}
