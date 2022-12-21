import { Alert, Button } from "@mui/material";
import "./LoginPage.css";
import "../App.css";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthRepository } from "../repositories/AuthRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
const logo = require("../assets/images/logo_typed.png");

interface LoginDfo {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const reset = searchParams.get("reset") === "true";
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [dfo, setDfo] = useState<LoginDfo>({ email: "", password: "" });

  async function _login() {
    setDisabled(true);
    setError(false);

    const object: ValidationObject = validationObject.validate({
      dfo: dfo,
      notNull: ["email", "password"],
      number: [],
    });

    setValidationObject(object);

    if (object.isValid) {
      const res = await AuthRepository.login(dfo.email, dfo.password);

      if (res) {
        navigate("/");
      } else {
        setError(true);
      }
    }

    setDisabled(false);
  }

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
      <img
        style={{ marginBottom: "2em" }}
        width={200}
        src={logo}
        alt="one-studio-logo"
      />

      <div className="login-page__form">
        {reset ? (
          <Alert severity="success" sx={{ marginBottom: "1.5em" }}>
            Your password was reset successfully.
          </Alert>
        ) : (
          <></>
        )}
        <CustomTextField
          variant="outlined"
          placeholder="Email"
          disabled={disabled}
          name="email"
          validationObject={validationObject}
          onChange={(v: string) => setDfo({ ...dfo, email: v })}
          width="w-60"
        />
        <CustomTextField
          variant="outlined"
          placeholder="Password"
          disabled={disabled}
          name="password"
          validationObject={validationObject}
          onChange={(v: string) => setDfo({ ...dfo, password: v })}
          width="w-60"
          style="mt-2"
        />
        <PrimaryButton
          style="mt-4"
          text="Login"
          onClick={_login}
          iconStyle="w-2"
          icon={require("../assets/images/forward-purple.png")}
        />
        {error ? (
          <div className="bg-light_red rounded-lg flex flex-col justify-center items-center mt-4">
            <span className="text-sm p-3">
              You have entered an invalid username or password.
            </span>
          </div>
        ) : (
          <></>
        )}
        <a
          className="mt-6 text-dark_blue text-sm font-medium"
          href="/reset-password"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
