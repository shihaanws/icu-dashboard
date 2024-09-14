import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ patientId, startDate, endDate }) => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={`/patient/${patientId}/neurology`}>
            Neurology
          </Link>
        </li>
        <li>
          <Link to={`/patient/${patientId}/labs`}>
            Labs
          </Link>
        </li>
        <li>
          <Link
            to={`/patient/${patientId}/ventilation`}
          >
            Ventilation
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
