import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full py-3 px-10 w-full h-15 flex flex-col items-center justify-center">
      <div>
        <span className="text-[120px] text-dark_blue font-bold flex flex-col items-center">
          ?
        </span>
        <span className="text-xl text-dark_blue font-medium">
          Oops! We couldn't find this page.
        </span>
      </div>
      <span onClick={() => navigate("/")} className='font-bold text-blue mt-10 cursor-pointer'>Back to Dashboard</span>
    </div>
  );
}
