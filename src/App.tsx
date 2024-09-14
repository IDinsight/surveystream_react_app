import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import FullScreenLoader from "./components/Loaders/FullScreenLoader";
import AppRoutes from "./config/routes";

import Header from "./components/Header";

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
