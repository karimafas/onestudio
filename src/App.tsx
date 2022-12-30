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
import { NotFound } from "./pages/NotFound";
import { ResetPassword } from "./pages/ResetPassword";
import { RequestService } from "./services/RequestService";
import { ImportPage } from "./pages/ImportPage";
import { AppConstants } from "./config/AppConstants";
import { CustomSnackBar } from "./components/CustomSnackBar";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.data.loading);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

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
    setPageLoaded(true);
  }

  function login() {
    setPageLoaded(true);
    setLoggedIn(true);
    dispatch(initialLoad());
  }

  function renderAuthorised() {
    setLoggedIn(false);
    setPageLoaded(true);
  }

  useEffect(() => {
    sessionStorage.setItem("url", window.location.href);
    const needsAuth = RequestService.needsAuth(location.pathname);

    if (!needsAuth) return renderAuthorised();

    AuthRepository.refreshToken().then((success) => {
      if (success) {
        login();
      } else {
        logout();
      }
    });

    return () => {};
  }, []);

  if (!pageLoaded) return <div></div>;

  if (loading && loggedIn) {
    return <div></div>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBackground />
          <div className="relative mt-[-100vh] flex flex-row overflow-hidden">
            <div>
              {loggedIn && AppConstants.hasSidebar(location.pathname) ? (
                <Sidebar />
              ) : (
                <></>
              )}
            </div>
            <div
              style={{
                width: loggedIn ? "calc(100vw - 15em)" : "100vw",
              }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/:id" element={<ItemPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <CustomSnackBar />
        </div>
      </ThemeProvider>
    );
  }
}
