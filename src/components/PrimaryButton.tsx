export function PrimaryButton(props: {
  onClick: Function;
  text: string;
  icon: any;
  type?: string;
}) {
  return (
    <button type="submit">
      <div
        onClick={() => props.onClick()}
        className="bg-light_purple2 h-10 rounded-lg cursor-pointer flex flex-row justify-around items-center px-4 transition-all duration-500"
      >
        <span className="font-semibold text-light_purple mr-4">
          {props.text}
        </span>
        <img className="w-5" src={props.icon} />
      </div>
    </button>
  );
}
