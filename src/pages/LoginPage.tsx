import "../App.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthRepository } from "../repositories/AuthRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { AppAlert, AppAlertType } from "../components/AppAlert";
import { useAppDispatch } from "../app/hooks";
import { authorise } from "../features/data/authSlice";
import { AppBackground } from "../components/AppBackground";

interface LoginDfo {
  email: string;
  password: string;
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [dfo, setDfo] = useState<LoginDfo>({ email: "", password: "" });
  const [searchParams] = useSearchParams();
  const reset = searchParams.get("reset");
  const fromReset = reset !== null && reset === "true";

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
      setDisabled(true);
      const success = await AuthRepository.login(dfo.email, dfo.password);
      setError(!success);

      if (success) dispatch(authorise());
    }

    setDisabled(false);
  }

  return (
    <div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center pointer-events-auto">
        <img
          style={{ marginBottom: "2em" }}
          width={200}
          src={ImageHelper.image(Images.logoTyped)}
          alt="one-studio-logo"
        />

        <div className="flex flex-col items-center">
          <CustomTextField
            variant="outlined"
            placeholder="Email"
            disabled={disabled}
            name="email"
            validationObject={validationObject}
            onChange={(v: string) => setDfo({ ...dfo, email: v })}
            width="w-64"
            onSubmit={_login}
          />
          <CustomTextField
            variant="outlined"
            placeholder="Password"
            disabled={disabled}
            name="password"
            validationObject={validationObject}
            onChange={(v: string) => setDfo({ ...dfo, password: v })}
            width="w-64"
            style="mt-2"
            onSubmit={_login}
            obscureText
          />
          <PrimaryButton
            style="mt-4 w-30"
            text="Login"
            onClick={_login}
            iconStyle="w-2"
            icon={ImageHelper.image(Images.forwardPurple)}
          />
          {error ? (
            <AppAlert
              type={AppAlertType.error}
              message="You have entered an invalid username or password."
              style="mt-6"
            />
          ) : (
            <></>
          )}
          {fromReset && !error ? (
            <AppAlert
              type={AppAlertType.success}
              message="Your password was reset successfully, please log in."
              style="mt-6"
            />
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
      <div className="mt-[-100vh] pointer-events-none">
        <AppBackground />
      </div>
    </div>
  );
}
