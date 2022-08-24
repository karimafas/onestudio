import { Button } from "@mui/material";
import "./LoginPage.css";
import "../App.css";
import { ApiHelper } from "../helpers/ApiHelper";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useEffect, useState } from "react";
import { Logger } from "../services/logger";
import { useNavigate } from "react-router-dom";
const logo = require("../assets/images/logo_typed.png");

interface LoginData {
  email: string;
  password: string;
}

export function LoginPage() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    ApiHelper.checkToken().then((value) => {
      if (value) navigate("/");
    });
    return () => {};
  }, []);

  async function _login(data: LoginData) {
    Logger.log(`logging in user with data`, data);
    const res = await ApiHelper.login(data.email, data.password);
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
        }}
      >
        <div className="login-page__form">
          <TextFieldElement
            size="small"
            name="email"
            disabled={disabled}
            className="login-page__input mb-1em"
            label="Email"
            sx={{ marginBottom: "1em" }}
          ></TextFieldElement>
          <TextFieldElement
            size="small"
            name="password"
            disabled={disabled}
            className="login-page__input"
            label="Password"
            type="password"
            sx={{ marginBottom: "1em" }}
          ></TextFieldElement>
          <Button size="small" type="submit">
            Login
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
