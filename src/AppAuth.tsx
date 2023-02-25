import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import App from "./App";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { AppBackground } from "./components/AppBackground";
import { AppConstants } from "./config/AppConstants";
import { LoginPage } from "./features/login/LoginPage";
import { refreshToken } from "./reducers/authSlice";

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
