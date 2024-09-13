import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { fetchNeurologyData } from "../api/patientData";
import { useQuery } from "react-query";
import { Select, Table } from "antd";

const NeurologyPage = () => {
  const { patientId } = useParams();
  const { date } = useParams();

  // Fetch patient data based on the pageToFetch
  const { data, isLoading, error } = useQuery(["neuroData", patientId], () =>
    fetchNeurologyData(patientId, date)
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
      render: (text) => new Date(text).toLocaleString(), // Formatting the date
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
      title: "Value Num",
      dataIndex: "valuenum",
      key: "valuenum",
    },
  ];

  console.log("neuroData", data);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div className="patient-page">
      <Sidebar patientId={patientId} date={date} />

      <Select
        defaultValue="lucy"
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "Yiminghe",
            label: "yiminghe",
          },
        ]}
      />

      <Table columns={columns} dataSource={data?.data} rowKey="index" />

      {/* <div className="patient-content">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NeurologyPage;
