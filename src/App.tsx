import { Route, Routes, useLocation } from "react-router-dom";
import { InventoryPage } from "./pages/InventoryPage";
import { ItemPage } from "./pages/ItemPage";
import Sidebar from "./components/Sidebar";
import { SettingsPage } from "./pages/SettingsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AppBackground } from "./components/AppBackground";
import { NotFound } from "./pages/NotFound";
import { ResetPassword } from "./pages/ResetPassword";
import { ImportPage } from "./pages/ImportPage";
import { AppConstants } from "./config/AppConstants";
import { CustomSnackBar } from "./components/CustomSnackBar";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initialLoad } from "./features/data/dataSlice";
import { CircularProgress } from "@mui/material";
import { InvitationPage } from "./pages/InvitationPage";
import { stopLoading } from "./features/data/dataSlice";

export default function App(props: { loadData: boolean }) {
  const dispatch = useAppDispatch();

  const loadingData = useAppSelector((state) => state.data.loading);

  useEffect(() => {
    if (props.loadData) {
      dispatch(initialLoad());
    } else {
      dispatch(stopLoading());
    }
  }, []);

  return (
    <div>
      <AppBackground />
      {loadingData ? <AppLoader /> : <AppBody />}
    </div>
  );
}

function AppBody() {
  const location = useLocation();

  return (
    <>
      <div className="relative mt-[-100vh] flex flex-row pointer-events-auto overflow-hidden">
        <div>
          {AppConstants.hasSidebar(location.pathname) ? <Sidebar /> : <></>}
        </div>
        <div
          style={{
            width: "calc(100vw - 15em)",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/:id" element={<ItemPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/invitation" element={<InvitationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <CustomSnackBar />
      <LoadingOverlay />
    </>
  );
}

export function AppLoader() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center relative mt-[-100vh]">
      <CircularProgress size="2rem" sx={{ color: "#120F9C" }} />
      <span className="text-dark_blue font-medium text-base mt-8">
        We are loading your data...
      </span>
    </div>
  );
}
