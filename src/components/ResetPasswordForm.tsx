import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { AuthRepository } from "../repositories/AuthRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "./CustomTextField";
import { PrimaryButton } from "./PrimaryButton";

interface ResetPasswordDfo {
  password: string;
}

export function ResetPasswordForm(props: { token: string }) {
  const navigate = useNavigate();
  const { token } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  const [dfo, setDfo] = useState<ResetPasswordDfo>({ password: "" });
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );

  async function resetPassword() {
    const object = validationObject.validate({
      dfo: dfo,
      notNull: ["password"],
      number: [],
    });

    setValidationObject(object);

    if (object.isValid) {
      // Reset password endpoint.
      const success = await AuthRepository.resetPassword(token, dfo.password);

      if (success) navigate("/?reset=true");
    }
  }

  async function checkTokenValidity() {
    const success = await AuthRepository.validatePasswordResetToken(token);

    setTokenExpired(!success);

    setLoading(false);
  }

  useEffect(() => {
    checkTokenValidity();
  }, []);

  if (loading) return <></>;

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
      <img
        width={200}
        src={ImageHelper.image(Images.logoTyped)}
        className="mb-6"
      />
      {tokenExpired ? (
        <>
          <span className="text-dark_blue text-sm text-center">
            This link has expired.
          </span>
          <PrimaryButton
            style="mt-4 w-30"
            text="Request a new link"
            onClick={() => navigate('/reset-password')}
            iconStyle="w-2"
            icon={ImageHelper.image(Images.forwardPurple)}
          />
        </>
      ) : (
        <>
          <span className="text-dark_blue text-sm text-center">
            Enter a new password below.
          </span>
          <CustomTextField
            onChange={(v: string) => setDfo({ ...dfo, password: v })}
            name="password"
            validationObject={validationObject}
            variant="outlined"
            placeholder="Password"
            width="w-64"
            style="mt-8"
            obscureText
          />
          <PrimaryButton
            style="mt-4 w-30"
            text="Reset password"
            onClick={resetPassword}
            iconStyle="w-2"
            icon={ImageHelper.image(Images.forwardPurple)}
          />
        </>
      )}
    </div>
  );
}
