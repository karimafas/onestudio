import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initialLoad } from "./features/data/dataSlice";
import { ApiHelper } from "./helpers/ApiHelper";
import { InventoryPage } from "./pages/InventoryPage";
import { ItemPage } from "./pages/ItemPage";
import { LoginPage } from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.data.loading);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    ApiHelper.checkToken().then((value) => {
      setLoggedIn(value);
      if (value) {
        dispatch(initialLoad());
      } else {
        ApiHelper.refreshToken().then((result) => {
          setLoggedIn(result);
          if (!result) {
            navigate("/login");
          } else {
            dispatch(initialLoad());
          }
        });
      }
    });
    return () => {};
  }, []);

  if (loading && loggedIn) {
    return <div></div>;
  } else {
    return (
      <div className="App">
        {loggedIn ? <Sidebar /> : <></>}
        <div style={{ width: "calc(100vw - 6em)" }}>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/:id" element={<ItemPage />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
