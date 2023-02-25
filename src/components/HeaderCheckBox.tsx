export function HeaderCheckBox(props: {
  selectedCount: number;
  totalCount: number;
  selectAll: Function;
  deselectAll: Function;
}) {
  if (props.totalCount === 0) return <></>;

  return (
    <div
      onClick={() => {
        if (props.selectedCount === props.totalCount) {
          props.deselectAll();
        } else {
          props.selectAll();
        }
      }}
      className={`cursor-pointer min-h-[20px] min-w-[20px] transition-all border-light_purple2 border-[3px] rounded flex flex-column justify-center items-center ${
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
