import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `url("https://pbs.twimg.com/ext_tw_video_thumb/1471176950416875522/pu/img/_FYPwpiUhgWc2VsM.jpg:large")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
        }}
      />
      {children}
      <ToastProvider
        placement="top-right"
        toastProps={{
          variant: "flat",
        }}
      />
    </HeroUIProvider>
  );
}
