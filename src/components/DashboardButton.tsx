export function DashboardButton(props: {
  text: string;
  image: any;
  onClick: Function;
}) {
  return (
    <div
      className="h-12 mb-4 cursor-pointer w-2/5"
      onClick={() => props.onClick()}
    >
      <div className="flex flex-col w-full mt-14 cursor-pointer">
        <div className="flex flex-row justify-between items-center px-6 h-12 bg-white shadow-xl rounded-xl text-light_purple font-medium">
          <span>{props.text}</span>
          <img className="w-5" src={props.image} />
        </div>
      </div>
    </div>
  );
}
