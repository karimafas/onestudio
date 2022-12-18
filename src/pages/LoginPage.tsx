import { Alert, Button } from "@mui/material";
import "./LoginPage.css";
import "../App.css";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthRepository } from "../repositories/AuthRepository";
const logo = require("../assets/images/logo_typed.png");

interface LoginData {
  email: string;
  password: string;
}

export function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const reset = searchParams.get("reset") === "true";

  async function _login(data: LoginData) {
    const res = await AuthRepository.login(data.email, data.password);
    return res;
  }

  return (
    <div className="login-page__wrapper">
      <img
        style={{ marginBottom: "2em" }}
        width={200}
        src={logo}
        alt="one-studio-logo"
      />
      <FormContainer
        onSuccess={async (data: LoginData) => {
          setDisabled(true);
          const result = await _login(data);
          setDisabled(false);

          if (result) {
            const savedUrl = sessionStorage.getItem("url");
            const url = savedUrl || "/";

            if (savedUrl) sessionStorage.removeItem("url");

            window.location.replace(url);
          }

          setError(!result);
        }}
      >
        <div className="login-page__form">
          {reset ? (
            <Alert severity="success" sx={{ marginBottom: "1.5em" }}>
              Your password was reset successfully.
            </Alert>
          ) : (
            <></>
          )}
          <TextFieldElement
            size="small"
            name="email"
            disabled={disabled}
            className="login-page__input mb-1em"
            label="Email"
            sx={{ marginBottom: "1em", width: "20em" }}
          ></TextFieldElement>
          <TextFieldElement
            size="small"
            name="password"
            disabled={disabled}
            className="login-page__input"
            label="Password"
            type="password"
            sx={{ marginBottom: "1em", width: "20em" }}
          ></TextFieldElement>
          {error ? (
            <Alert severity="error" sx={{ marginBottom: "1.5em" }}>
              You have entered an invalid username or password.
            </Alert>
          ) : (
            <></>
          )}
          <Button
            sx={{ width: "8em", marginBottom: "1em" }}
            variant="outlined"
            type="submit"
          >
            Login
          </Button>
          <a className="login__reset-txt" href="/reset-password">
            Forgot your password?
          </a>
        </div>
      </FormContainer>
    </div>
  );
}
