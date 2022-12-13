export function CheckBox(props: { selected: boolean; onClick: Function }) {
  return (
    <div
      onClick={() => props.onClick()}
      className={`cursor-pointer h-5 w-5 transition-all border border-light_purple2 border-[3px] rounded ${
        !props.selected ? "" : "bg-light_purple border-light_purple"
      }`}
    ></div>
  );
}
