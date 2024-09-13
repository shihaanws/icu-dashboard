import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css"; // Import your Tailwind CSS here

// Pages
import LandingPage from "./pages/LandingPage";
import NeurologyPage from "./pages/NeurologyPage";
import LabsPage from "./pages/LabsPage";
import VentilationPage from "./pages/VentilationPage";

// Initialize React Query Client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          {/* Define your routes here */}
          <Routes>
            {/* Landing page route */}
            <Route path="/" element={<Navigate to="/patients" />} />

            {/* List of all patients */}
            <Route path="/patients" element={<LandingPage />} />

            {/* Patient-specific routes */}
            <Route
              path="/patient/:patientId/:date/neurology"
              element={<NeurologyPage />}
            ></Route>

            <Route
              path="/patient/:patientId/:date/labs"
              element={<LabsPage />}
            ></Route>

            <Route
              path="/patient/:patientId/:date/ventilation"
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
