export function PrimaryButton(props: {
  onClick: Function;
  text: string;
  icon?: any;
  type?: string;
  backgroundColor?: string;
  textColor?: string;
  iconStyle?: string;
  style?: string;
}) {
  return (
    <div
      onClick={() => props.onClick()}
      className={`${
        props.backgroundColor ?? "bg-light_purple2"
      } h-10 rounded-lg cursor-pointer flex flex-row ${
        props.icon ? "justify-around" : "justify-center"
      } items-center px-4 transition-all duration-500 ${props.style ?? ""}`}
    >
      <span
        className={`font-semibold ${
          props.textColor ?? "text-light_purple"
        } mr-4 text-center`}
      >
        {props.text}
      </span>
      {!props.icon ? (
        <> </>
      ) : (
        <img className={`w-5 ${props.iconStyle ?? ""}`} src={props.icon} />
      )}
    </div>
  );
}
