export function SquareButton(props: { icon: any; onClick: Function }) {
  return (
    <div
      onClick={() => props.onClick()}
      className="h-10 w-10 bg-light_purple2 rounded-lg flex flex-col justify-center items-center"
    >
      <img src={props.icon} className="w-4" />
    </div>
  );
}
