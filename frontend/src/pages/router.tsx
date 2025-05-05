import { RouteObject } from "react-router-dom";

import { postRouter } from "./post/router";
import { profileRouter } from "./profile/router";

import IndexPage from "./index";

const routers: RouteObject[] = [
  {
    index: true,
    element: <IndexPage />,
  },
  ...profileRouter,
  ...postRouter,
];

export default routers;
