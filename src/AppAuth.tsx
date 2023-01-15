import { useEffect } from "react";
import App from "./App";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { AppBackground } from "./components/AppBackground";
import { refreshToken } from "./features/data/authSlice";
import { LoginPage } from "./pages/LoginPage";

export function AppAuth() {
  const dispatch = useAppDispatch();
  const authorised = useAppSelector((state) => state.auth.authorised);
  const loadingAuth = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(refreshToken());
  }, []);

  if (loadingAuth) return <AppBackground />;

  if (!authorised) return <LoginPage />;

  return <App />;
}
