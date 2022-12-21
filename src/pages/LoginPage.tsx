import "../App.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthRepository } from "../repositories/AuthRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ImageHelper, Images } from "../helpers/ImageHelper";

interface LoginDfo {
  email: string;
  password: string;
}

export function LoginPage() {
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
      const result = await AuthRepository.login(dfo.email, dfo.password);

      if (result) {
        const savedUrl = sessionStorage.getItem("url");
        let url = savedUrl || "/";

        sessionStorage.removeItem("url");

        if (url.includes("login") || url.includes("reset-password")) url = "/";

        window.location.replace(url);
      }

      setError(!result);
    }

    setDisabled(false);
  }

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
      <img
        style={{ marginBottom: "2em" }}
        width={200}
        src={ImageHelper.image(Images.logoTyped)}
        alt="one-studio-logo"
      />

      <div className="flex flex-col items-center">
        {fromReset ? (
          <div className="bg-green rounded-lg flex flex-col justify-center items-center mt-2 mb-8">
            <span className="text-sm p-3 text-dark_blue">
              Your password was reset successfully, please log in.
            </span>
          </div>
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
          <div className="bg-light_red rounded-lg flex flex-col justify-center items-center mt-4">
            <span className="text-sm p-3 text-dark_blue">
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
