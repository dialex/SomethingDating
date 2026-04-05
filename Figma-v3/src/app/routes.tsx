import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import PhasePage from "./pages/PhasePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/phase/:phaseId",
    Component: PhasePage,
  },
]);
