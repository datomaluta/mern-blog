import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import ThemeProvider from "./components/sharedComponents/ThemeProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>{" "}
    </Provider>
  </PersistGate>
);
