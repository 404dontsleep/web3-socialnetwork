import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.css";
import routers from "./pages/router";
import DefaultLayout from "./layouts/default-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: routers,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
