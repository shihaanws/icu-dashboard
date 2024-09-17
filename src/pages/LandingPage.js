import React, { useEffect, useState } from "react";

import { Button, Table } from "antd";
import { Link } from "react-router-dom";

import { useDataFetch } from "../hooks/useDataFetch";
import { fetchPatientList, fetchPatientStats } from "../api/patientData";
import {
  convertDaysToReadableFormat,
  formatDateTime,
} from "../utils/dateUtils";

import PageLayout from "../components/PageLayout";
import LoadingSkeleton from "../components/LoadingSkeleton";
import StatCard from "../components/StatCard";

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageToFetch, setPageToFetch] = useState(currentPage);
  const [loader, setLoader] = useState(true);

  const columns = [
    { title: "Patient ID", dataIndex: "subject_id", key: "subject_id" },
    {
      title: "Admission Date",
      dataIndex: "intime",
      key: "intime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Discharge Date",
      dataIndex: "outtime",
      key: "outtime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Length of Stay (days)",
      dataIndex: "los",
      key: "los",
      render: (text) => convertDaysToReadableFormat(text),
    },
    { title: "Care Unit", dataIndex: "first_careunit", key: "first_careunit" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/patient/${record.stay_id}/neurology`}>
          <Button type="link">More Details</Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    setPageToFetch(currentPage);
  }, [currentPage]);

  const { data: patientData, isLoading } = useDataFetch(
    "patientData",
    fetchPatientList,
    [pageToFetch]
  );

  const { data: patientStatsData, isLoadingStats } = useDataFetch(
    "patientStatsData",
    fetchPatientStats,
    [null]
  );

  useEffect(() => {
    if (patientData) setLoader(false);
  }, [patientData]);

  const patients = patientData?.data || [];
  const totalPatients = patientStatsData?.data?.stay_count || 0;
  const avgStayLength =
    convertDaysToReadableFormat(patientStatsData?.data?.avg_los?._avg?.los) ||
    0;

  return (
    <div>
      <PageLayout landingPageMode={true}>
        {isLoading || loader ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <div className="flex-1 min-w-[200px]">
                <StatCard
                  statValues={[
                    "Total Number of Stays",
                    totalPatients,
                    "stays.svg",
                  ]}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <StatCard
                  statValues={[
                    "Average Length of Stay",
                    avgStayLength,
                    "avg.svg",
                  ]}
                />
              </div>
            </div>
            <Table
              scroll={{ x: 1000 }} 
              columns={columns}
              dataSource={patients}
              rowKey="subject_id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: totalPatients,
                onChange: (page) => setCurrentPage(page),
              }}
              className="mt-5" 
            />
          </>
        )}
      </PageLayout>
    </div>
  );
};

export default LandingPage;
