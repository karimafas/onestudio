export function SquareButton(props: { icon: any; onClick: Function }) {
  return (
    <div
      onClick={() => props.onClick()}
      className="h-10 w-10 bg-light_purple2 rounded-lg flex flex-col justify-center items-center cursor-pointer p-2"
    >
      <img src={props.icon} className="object-contain h-full w-full" />
    </div>
  );
}
