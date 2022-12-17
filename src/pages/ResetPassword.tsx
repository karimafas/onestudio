import { Alert, Button, Typography } from "@mui/material";
import "./LoginPage.css";
import "../App.css";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useEffect, useState } from "react";
import { ApiHelper } from "../helpers/ApiHelper";
import { useNavigate, useSearchParams } from "react-router-dom";
const logo = require("../assets/images/logo_typed.png");

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop: string) => searchParams.get(prop),
});

export function ResetPassword() {
  const [loading, setLoading] = useState<boolean>(true);
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [matchError, setMatchError] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<boolean>(false);

  const fromEmail = searchParams.get("reset") === "true";
  const token = searchParams.get("id");

  useEffect(() => {
    ApiHelper.checkToken().then((value) => {
      if (value) {
        navigate("/");
      } else {
        if (token) {
          ApiHelper.checkResetToken(token).then((value) => {
            if (!value) setTokenError(true);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    });
    return () => {};
  }, []);

  return (
    <div className="login-page__wrapper">
      <img
        style={{ marginBottom: "2em" }}
        width={200}
        src={logo}
        alt="one-studio-logo"
      />
      {loading ? (
        <></>
      ) : tokenError ? (
        <Alert severity="error" sx={{ marginBottom: "1.5em" }}>
          This link has expired. Please request a new one from the Login page.
        </Alert>
      ) : (
        <FormContainer
          onSuccess={async (data: {
            email: string | undefined;
            password: string | undefined;
            confirmPassword: string | undefined;
          }) => {
            if (fromEmail) {
              if (!(data.password && data.confirmPassword && token)) return;
              setMatchError(data.password !== data.confirmPassword);
              const success = await ApiHelper.resetPassword(
                token,
                data.password
              );
              if (success) {
                navigate("/login?reset=true");
              }
            } else {
              if (!data.email) return;
              setEmail(data.email);
              const success = await ApiHelper.resetToken(data.email);
              setSent(success);
            }
          }}
        >
          {fromEmail ? (
            <div className="login-page__form">
              <Typography sx={{ marginBottom: "1em" }}>
                Enter a new password for your account.
              </Typography>
              <TextFieldElement
                size="small"
                name="password"
                type="password"
                className="login-page__input mb-1em"
                label="Password"
                sx={{ marginBottom: "1em", width: "20em" }}
                required
              ></TextFieldElement>
              <TextFieldElement
                size="small"
                name="confirmPassword"
                type="password"
                className="login-page__input mb-1em"
                label="Confirm Password"
                sx={{ marginBottom: "1.5em", width: "20em" }}
                required
              ></TextFieldElement>
              {matchError ? (
                <Alert severity="error" sx={{ marginBottom: "1.5em" }}>
                  Passwords must match.
                </Alert>
              ) : (
                <></>
              )}
              <Button
                sx={{ marginBottom: "1em" }}
                variant="outlined"
                type="submit"
              >
                Reset password
              </Button>
            </div>
          ) : sent ? (
            <Typography>
              We’ve sent a message to <strong>{email}</strong> with a link to
              reset your password.
            </Typography>
          ) : (
            <div className="login-page__form">
              <TextFieldElement
                size="small"
                name="email"
                className="login-page__input mb-1em"
                label="Email"
                sx={{ marginBottom: "1em", width: "20em" }}
                required
              ></TextFieldElement>
              <Button
                sx={{ marginBottom: "1em" }}
                variant="outlined"
                type="submit"
              >
                Send verification code
              </Button>
            </div>
          )}
        </FormContainer>
      )}
    </div>
  );
}