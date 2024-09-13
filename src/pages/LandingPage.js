import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPatientStats, fetchPatientList } from "../api/patientData";
import { Table, Button, Space } from "antd";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageToFetch, setPageToFetch] = useState(currentPage); // New state to control API fetching

  // Effect to update pageToFetch when currentPage changes
  useEffect(() => {
    setPageToFetch(currentPage);
  }, [currentPage]);

  // Fetch patient data based on the pageToFetch
  const { data, isLoading, error } = useQuery(["patients", pageToFetch], () =>
    fetchPatientList(pageToFetch)
  );

  const {
    data: patientStatsData,
    isLoadingStats,
    errorStats,
  } = useQuery(["patientStats"], () => fetchPatientStats());

  const patients = data?.data || [];
  const totalPatients = patientStatsData?.data?.stay_count || 0;

  console.log("totalPatients", totalPatients);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  const columns = [
    {
      title: "Subject ID",
      dataIndex: "subject_id",
      key: "subject_id",
    },
    {
      title: "Admission Date",
      dataIndex: "intime",
      key: "intime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Discharge Date",
      dataIndex: "outtime",
      key: "outtime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Length of Stay (days)",
      dataIndex: "los",
      key: "los",
    },
    {
      title: "Care Unit",
      dataIndex: "first_careunit",
      key: "first_careunit",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/patient/${record.stay_id}/${record.intime.slice(
              0,
              10
            )}/neurology`}
          >
            <Button type="link">Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>ICU Patients</h1>
      <Table
        className="p-16"
        columns={columns}
        dataSource={patients}
        rowKey="subject_id"
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: totalPatients,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </div>
  );
};

export default LandingPage;
