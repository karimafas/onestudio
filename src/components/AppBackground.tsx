export function AppBackground() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-col h-1/2 w-full justify-start">
        <div className="w-[30vw] h-[30vh] bg-blue rotate-[15deg] opacity-30 translate-x-[50vw] translate-y-[-55%] blur-2xl"></div>
      </div>
      <div className="flex flex-row h-1/2 w-full justify-between">
        <div className="w-[45vh] h-[45vh] mt-[10vh] bg-blue rotate-12 blur-3xl opacity-25"></div>
        <div className="w-[35vh] h-[35vh] bg-blue mt-[10vh] -rotate-12 blur-3xl opacity-10"></div>
      </div>
    </div>
  );
}
