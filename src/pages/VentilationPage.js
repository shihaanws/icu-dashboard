import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  fetchLabsData,
  fetchNeurologyData,
  fetchVentilationData,
} from "../api/patientData";
import { useQuery } from "react-query";
import { Table } from "antd";

const VentilationPage = () => {
  const { patientId } = useParams();
  const { date } = useParams();

  // Fetch patient data based on the pageToFetch
  const { data, isLoading, error } = useQuery(
    ["ventilationData", patientId],
    () => fetchVentilationData(patientId, date)
  );

  const columns = [
    {
      title: "Subject ID",
      dataIndex: "subject_id",
      key: "subject_id",
    },
    {
      title: "Stay ID",
      dataIndex: "stay_id",
      key: "stay_id",
    },
    {
      title: "Chart Time",
      dataIndex: "charttime",
      key: "charttime",
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Unit",
      dataIndex: "valueuom",
      key: "valueuom",
      render: (text) => (text ? text : "N/A"), // Show "N/A" if unit is missing
    },
    {
      title: "Parameter Type",
      dataIndex: "param_type",
      key: "param_type",
    },
    {
      title: "Parameter Category",
      dataIndex: "param_category",
      key: "param_category",
    },
  ];

  console.log("neuroData", data);

  return (
    <div className="patient-page">
      <Sidebar patientId={patientId} date={date} />

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="index"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default VentilationPage;
