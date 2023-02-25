import { ImageHelper, Images } from "../helpers/ImageHelper";

export function TablePaginationControls(props: {
  page: number;
  setPage: Function;
  totalPages: number;
}) {
  const { page, setPage, totalPages } = props;

  return (
    <div className="flex flex-row justify-center mb-6">
      <div
        className={`${
          page === 0 ? "opacity-30" : "cursor-pointer"
        } flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg`}
        onClick={() => {
          if (page === 0) return;
          setPage(page - 1);
        }}
      >
        <img className="w-[5.5px]" src={ImageHelper.image(Images.backBlue)} />
      </div>
      <div className="h-8 w-12 bg-light_purple2 mx-4 rounded-lg flex flex-row justify-center items-center text-xs font-semibold text-light_purple">
        {page + 1} / {!totalPages ? 1 : totalPages}
      </div>
      <div
        className={`${
          page === totalPages - 1 ? "opacity-30" : "cursor-pointer"
        } flex flex-col items-center justify-center w-8 h-8 bg-light_purple2 rounded-lg`}
        onClick={() => {
          if (page === totalPages - 1) return;
          setPage(page + 1);
        }}
      >
        <img
          className="w-[5.5px]"
          src={ImageHelper.image(Images.forwardBlue)}
        />
      </div>
    </div>
  );
}
