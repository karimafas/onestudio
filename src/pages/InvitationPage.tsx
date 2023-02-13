import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppAlert, AppAlertType } from "../components/AppAlert";
import { CustomTextField } from "../components/CustomTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { RetrievedInvitationDto } from "../objects/RetrievedInvitationDto";
import { AuthRepository } from "../repositories/AuthRepository";
import { InvitationRepository } from "../repositories/InvitationRepository";
import { ValidationObject } from "../services/ValidationService";

export interface RegistrationDfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studioId: number | undefined;
}

export function InvitationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [validationObject, setValidationObject] = useState<ValidationObject>(
    ValidationObject.empty()
  );
  const [dfo, setDfo] = useState<RegistrationDfo>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studioId: undefined,
  });
  const [retrievedInvitation, setRetrievedInvitation] = useState<
    RetrievedInvitationDto | undefined
  >();
  const [error, setError] = useState<boolean>(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);

  useEffect(() => {
    _retrieveInvitation();
  }, []);

  async function _retrieveInvitation() {
    const token = searchParams.get("id");
    if (!token) return;
    const invitation = await InvitationRepository.retrieveInvitation(token);
    setAlreadyRegistered(invitation.userAlreadyRegistered);
    setLoading(false);

    if (!invitation.success) {
      setError(true);
      return;
    }

    setRetrievedInvitation(invitation.invitation);
    setDfo({
      ...dfo,
      email: invitation.invitation?.invitedEmail ?? "",
      studioId: invitation.invitation?.studio.id,
    });
  }

  async function _register() {
    const object = validationObject.validate({
      dfo: dfo,
      notNull: ["email", "firstName", "lastName", "password"],
      number: [],
    });
    setValidationObject(object);
    if (!object.isValid) return;
    if (!retrievedInvitation) return;

    const success = await AuthRepository.registerFrominvitation(
      retrievedInvitation.id,
      dfo
    );

    if (success) {
      navigate("/");
      window.location.reload();
    }
  }

  if (loading)
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <CircularProgress size="2rem" sx={{ color: "#120F9C" }} />
      </div>
    );

  if (alreadyRegistered || error)
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <AppAlert
          type={AppAlertType.error}
          message={
            alreadyRegistered
              ? "A OneStudio account already exists with this email. Please login instead."
              : "This link is invalid or expired. Please request a new link."
          }
        />
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col bg-lightest_purple2 rounded-xl drop-shadow-2xl p-8 w-[25em]">
        <img
          className="w-[10em] ml-2 mb-4"
          src={ImageHelper.image(Images.logoTyped)}
        />
        <CustomTextField
          placeholder="email"
          name="email"
          validationObject={validationObject}
          defaultValue={dfo.email}
          onChange={() => {}}
          width="w-full"
          style="mb-2"
          disabled
        ></CustomTextField>
        <CustomTextField
          placeholder="First name"
          name="firstName"
          validationObject={validationObject}
          onChange={(v: string) => setDfo({ ...dfo, firstName: v })}
          width="w-full"
          style="mb-2"
        ></CustomTextField>
        <CustomTextField
          placeholder="Last name"
          name="lastName"
          validationObject={validationObject}
          onChange={(v: string) => setDfo({ ...dfo, lastName: v })}
          width="w-full"
          style="mb-2"
        ></CustomTextField>
        <CustomTextField
          placeholder="Password"
          name="password"
          validationObject={validationObject}
          onChange={(v: string) => setDfo({ ...dfo, password: v })}
          width="w-full"
          style="mb-2"
          obscureText
        ></CustomTextField>
      </div>
      <PrimaryButton
        text="Complete registration"
        backgroundColor="bg-blue"
        textColor="text-white"
        icon={ImageHelper.image(Images.check)}
        onClick={_register}
        style="mt-8"
      />
    </div>
  );
}
