import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import FullScreenLoader from "./components/Loaders/FullScreenLoader";
import AppRoutes from "./config/routes";

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
