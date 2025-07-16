import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import PalmReader from "./components/PalmReader";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import About from "./components/About";
import Contact from "./components/Contact";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <>
        <Routes>
          <Route path="/" element={<PalmReader />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
