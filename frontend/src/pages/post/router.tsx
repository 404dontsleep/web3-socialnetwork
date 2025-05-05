import { RouteObject } from "react-router-dom";

import CreatePostPage from "./create";
import PostDetailPage from "./detail";

import PostPage from ".";
export const postRouter: RouteObject[] = [
  {
    path: "post",
    element: <PostPage />,
  },
  {
    path: "post/create",
    element: <CreatePostPage />,
  },
  {
    path: "post/:id",
    element: <PostDetailPage />,
  },
];
