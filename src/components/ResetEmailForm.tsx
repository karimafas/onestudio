import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { AuthRepository } from "../repositories/AuthRepository";
import { ValidationObject } from "../services/ValidationService";
import { CustomTextField } from "./CustomTextField";
import { PrimaryButton } from "./PrimaryButton";

interface ResetPasswordDfo {
  email: string;
}

export function ResetEmailForm() {
  const [dfo, setDfo] = useState<ResetPasswordDfo>({ email: "" });
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [emailSent, setEmailSent] = useState<boolean>(false);

  async function handleSubmit() {
    const object = validationObject.validate({
      dfo: dfo,
      notNull: ["email"],
      number: [],
    });

    setValidationObject(object);

    if (object.isValid) {
      // Send email with link.
      const success = await AuthRepository.sendPasswordResetEmail(dfo.email);

      if (success) {
        setEmailSent(true);
      }
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
      <img
        width={200}
        src={ImageHelper.image(Images.logoTyped)}
        className="mb-6"
      />
      {!emailSent ? (
        <span className="text-dark_blue text-sm text-center">
          Please enter your email below.<br></br>We'll send a link to reset your
          password.
        </span>
      ) : (
        <span className="text-dark_blue text-sm text-center">
          Check your inbox and follow the link provided.
        </span>
      )}
      {!emailSent ? (
        <>
          <CustomTextField
            onChange={(v: string) => setDfo({ ...dfo, email: v })}
            name="email"
            validationObject={validationObject}
            variant="outlined"
            placeholder="Email"
            width="w-64"
            style="mt-8"
          />
          <PrimaryButton
            style="mt-4 w-30"
            text="Send link"
            onClick={handleSubmit}
            iconStyle="w-2"
            icon={ImageHelper.image(Images.forwardPurple)}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
