import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppAuth } from "./AppAuth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider
    store={store}
    children={
      <BrowserRouter>
        <AppAuth />
      </BrowserRouter>
    }
  ></Provider>
);

reportWebVitals();
