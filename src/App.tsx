import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initialLoad } from "./features/data/dataSlice";
import { InventoryPage } from "./pages/InventoryPage";
import { ItemPage } from "./pages/ItemPage";

function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.data.loading);

  useEffect(() => {
    dispatch(initialLoad());
    return () => {};
  }, []);

  if (loading) {
    return <div></div>;
  } else {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/:id" element={<ItemPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;
