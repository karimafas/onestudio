export function PrimaryButton(props: { onClick: Function }) {
  return (
    <div
      onClick={() => props.onClick()}
      className="bg-light_purple2 h-10 w-48 rounded-lg cursor-pointer flex flex-row justify-around items-center px-4 hover:shadow-lg transition-all duration-500"
    >
      <span className="font-semibold text-light_purple">Add an item</span>
      <img className="w-5" src={require("../assets/images/add-purple.png")} />
    </div>
  );
}
