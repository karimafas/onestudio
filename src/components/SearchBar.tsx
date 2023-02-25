export function SearchBar(props: { onChange: Function }) {
  return (
    <div className="h-10 w-1/3 rounded-lg border-light_purple2 border-[2px] px-2">
      <input
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="Search..."
        className="w-full h-full border-0 outline-none caret-light_purple text-dark_blue text-sm"
      ></input>
    </div>
  );
}
