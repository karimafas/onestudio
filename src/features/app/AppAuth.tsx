import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppBackground } from "../../components/AppBackground";
import { AppConstants } from "../../config/AppConstants";
import { refreshToken } from "../../reducers/authSlice";
import { LoginPage } from "../login/LoginPage";
import App from "./App";

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

  return <App loadData={!unauthorisedRoute} />;
}
