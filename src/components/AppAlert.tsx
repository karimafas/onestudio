export enum AppAlertType {
  success,
  warning,
  error,
}

export function AppAlert(props: {
  type: AppAlertType;
  message: string;
  style?: string;
}) {
  function background() {
    switch (props.type) {
      case AppAlertType.error:
        return "bg-light_red";
      case AppAlertType.success:
        return "bg-green";
      case AppAlertType.warning:
        return "bg-green";
    }
  }

  return (
    <div
      className={`${background()} bg-green rounded-lg flex flex-col justify-center items-center ${
        props.style ?? ""
      }`}
    >
      <span className="text-sm p-3 text-dark_blue">{props.message}</span>
    </div>
  );
}
