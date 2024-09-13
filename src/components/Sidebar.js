import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ patientId, date }) => {
  
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={`/patient/${patientId}/${date}/neurology`}>Neurology</Link>
        </li>
        <li>
          <Link to={`/patient/${patientId}/${date}/labs`}>Labs</Link>
        </li>
        <li>
          <Link to={`/patient/${patientId}/${date}/ventilation`}>
            Ventilation
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
