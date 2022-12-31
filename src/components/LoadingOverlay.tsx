import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { useAppSelector } from "../app/hooks";

export function LoadingOverlay() {
  const loading = useAppSelector((state) => state.ui.loading);

  const opacity = loading ? "opacity-100" : "opacity-0";
  const pointerEvents = loading
    ? "pointer-events-autio"
    : "pointer-events-none";

  return (
    <div
      className={`relative mt-[-100vh] h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.5)] flex flex-col justify-center items-center transition-all ${opacity} ${pointerEvents}`}
    >
      <div className="flex flex-col h-32 w-[15rem] bg-white rounded-2xl justify-center items-center">
        <CircularProgress size="1.5rem" className="mb-4" />
        <span className="text-dark_blue font-semibold">Loading...</span>
      </div>
    </div>
  );
}
