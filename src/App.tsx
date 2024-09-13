import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import FullScreenLoader from "./components/Loaders/FullScreenLoader";
import AppRoutes from "./config/routes";

import HeaderBis from "./components/HeaderBis";

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <BrowserRouter>
        <HeaderBis />
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
