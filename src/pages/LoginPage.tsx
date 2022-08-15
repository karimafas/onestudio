import { Button } from "@mui/material";
import "./LoginPage.css";
import "../App.css";
import { ApiHelper } from "../helpers/ApiHelper";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useState } from "react";
import { Logger } from "../services/logger";

interface LoginData {
  email: string;
  password: string;
}

export function LoginPage() {
  const [disabled, setDisabled] = useState<boolean>(false);

  async function _login(data: LoginData) {
    Logger.log(`logging in user with data`, data);
    const res = await ApiHelper.login(data.email, data.password);
    return res;
  }

  return (
    <div className="login-page__wrapper">
      <FormContainer
        onSuccess={async (data: LoginData) => {
          setDisabled(true);
          const result = await _login(data);
          setDisabled(false);

          if (result) {
            window.location.replace("/");
          }
        }}
      >
        <div className="login-page__form">
          <TextFieldElement
            name="email"
            disabled={disabled}
            className="login-page__input mb-1em"
            label="Email"
            sx={{ marginBottom: "1em" }}
          ></TextFieldElement>
          <TextFieldElement
            name="password"
            disabled={disabled}
            className="login-page__input"
            label="Password"
            type="password"
            sx={{ marginBottom: "1em" }}
          ></TextFieldElement>
          <Button type="submit">Login</Button>
        </div>
      </FormContainer>
    </div>
  );
}
