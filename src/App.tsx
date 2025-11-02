import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import appTheme from "./theme";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routers";

function App() {

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRouter} />
        <ToastContainer
          aria-label="Notification Toasts"
          position="bottom-center"
          autoClose={3000}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;