import { useSearchParams } from "react-router-dom";
import { ResetEmailForm } from "./components/ResetEmailForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("id");
  const fromEmail = token !== null;

  if (fromEmail) return <ResetPasswordForm token={token ?? ""} />;

  return <ResetEmailForm />;
}
