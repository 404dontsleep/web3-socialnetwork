import { Outlet } from "react-router-dom";

import { Provider } from "@/provider";
import Navbar from "@/components/navbar";

export default function DefaultLayout() {
  return (
    <Provider>
      <section className="flex flex-col h-screen overflow-y-auto bg-background text-foreground">
        <Navbar />
        <Outlet />
      </section>
    </Provider>
  );
}
