import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css"; 

import LandingPage from "./pages/LandingPage";
import NeurologyPage from "./pages/NeurologyPage";
import LabsPage from "./pages/LabsPage";
import VentilationPage from "./pages/VentilationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/patients" />} />

            <Route path="/patients" element={<LandingPage />} />

            <Route
              path="/patient/:patientId/neurology"
              element={<NeurologyPage />}
            />

            <Route
              path="/patient/:patientId/labs"
              element={<LabsPage />}
            ></Route>

            <Route
              path="/patient/:patientId/ventilation"
              element={<VentilationPage />}
            ></Route>

            {/* Catch all for undefined routes */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
