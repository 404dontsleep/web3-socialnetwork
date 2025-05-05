import { RouteObject } from "react-router-dom";

import RegisterPage from "./register";

import ProfilePage from ".";
export const profileRouter: RouteObject[] = [
  {
    path: "profile/register",
    element: <RegisterPage />,
  },
  {
    path: "profile/:address",
    element: <ProfilePage />,
  },
];
