import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

const appRouter = createBrowserRouter([
  { path: "/", index: true, element: <Home /> },
]);

export default appRouter;
