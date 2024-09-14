import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPatientStats, fetchPatientList } from "../api/patientData";
import { Table, Button, Space } from "antd";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

import StatCard from "../components/StatCard";

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

  function convertDaysToReadableFormat(days) {
    // Get the integer part of the days
    let integerDays = Math.floor(days);

    // Calculate the fractional part in hours
    let hours = Math.round((days - integerDays) * 24);

    // Construct the result string
    let result = "";
    if (integerDays > 0) {
      result += `${integerDays} day${integerDays !== 1 ? "s" : ""}`;
    }
    if (hours > 0) {
      if (result) result += " and ";
      result += `${hours} hour${hours !== 1 ? "s" : ""}`;
    }

    // If there is no valid result, return a default message
    if (result === "") {
      return "0 hours";
    }

    return result;
  }

  const patients = data?.data || [];
  const totalPatients = patientStatsData?.data?.stay_count || 0;
  let avgStayLength =
    convertDaysToReadableFormat(patientStatsData?.data?.avg_los?._avg?.los) ||
    0;

  console.log(avgStayLength, "avgStayLength");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading patients</div>;

  // Function to calculate the number of days between two dates
  function calculateDaysBetweenDates(startDate, endDate) {
    // Convert the date strings to Date objects
    const intime = new Date(startDate);
    const outtime = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMs = outtime - intime;

    // Convert milliseconds to whole days
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil(differenceInMs / millisecondsPerDay);
  }

  // Define the dates
  const startDate = "2187-05-18T18:39:00.000Z";
  const endDate = "2187-05-20T16:04:02.000Z";

  // Calculate and log the number of days
  const numberOfDays = calculateDaysBetweenDates(startDate, endDate);
  console.log(numberOfDays); // Output: 3

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
      render: (text) => convertDaysToReadableFormat(text),
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
            to={`/patient/${record.stay_id}/neurology`}
          >
            <Button type="link">Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageLayout landingPageMode={true}>
        <div className="flex gap-4 w-full">
          <StatCard statValues={["Total Number of Stays", totalPatients, "stays.svg"]} />
          <StatCard statValues={["Average Length of Stay", avgStayLength, "avg.svg"]} />
        </div>

        <Table
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
      </PageLayout>
    </div>
  );
};

export default LandingPage;
