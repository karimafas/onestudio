export function HeaderCheckBox(props: {
  selectedCount: number;
  totalCount: number;
  selectAll: Function;
  deselectAll: Function;
}) {
  return (
    <div
      onClick={() => {
        if (props.selectedCount === props.totalCount)
          return props.deselectAll();
        props.selectAll();
      }}
      className={`cursor-pointer h-5 w-5 transition-all border border-light_purple2 border-[3px] rounded flex flex-column justify-center items-center ${
        props.selectedCount === 0 ? "" : "bg-light_purple border-light_purple"
      }`}
    >
      {props.selectedCount > 0 && props.selectedCount < props.totalCount ? (
        <div className="h-2 w-2 bg-white rounded-lg"></div>
      ) : (
        <></>
      )}
    </div>
  );
}
