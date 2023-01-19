import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import App from "./App";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { AppBackground } from "./components/AppBackground";
import { AppConstants } from "./config/AppConstants";
import { refreshToken } from "./features/data/authSlice";
import { LoginPage } from "./pages/LoginPage";

export function AppAuth() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authorised = useAppSelector((state) => state.auth.authorised);
  const loadingAuth = useAppSelector((state) => state.auth.loading);

  const unauthorisedRoute = AppConstants.unauthorisedRoutes.includes(
    location.pathname.replace("/", "")
  );

  useEffect(() => {
    dispatch(refreshToken());
  }, []);

  if (loadingAuth) return <AppBackground />;

  if (!authorised && !unauthorisedRoute) return <LoginPage />;

  return <App />;
}
