// pages/VentilationPage.js
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Segmented, Select, Skeleton, Table, Row, Col, Tag } from "antd";
import PageLayout from "../components/PageLayout";
import { fetchDateRange, fetchVentilationData } from "../api/patientData";

const VentilationPage = () => {
  const { patientId } = useParams();

  // Fetch date range data using useQuery
  const {
    data: rangeData,
    isLoading: isLoadingRange,
    error: errorRange,
  } = useQuery(["ventRange", patientId], () =>
    fetchDateRange(patientId, "ventilation")
  );

  // Initialize state for startDate, endDate, and selectedDay
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [options, setOptions] = useState([]);

  // Update startDate, endDate, and selectedDay when rangeData is fetched
  useEffect(() => {
    if (rangeData?.data) {
      const fetchedStartDate = rangeData.data.start_time?.slice(0, 10);
      const fetchedEndDate = rangeData.data.end_time?.slice(0, 10);

      setStartDate(fetchedStartDate);
      setEndDate(fetchedEndDate);
      setSelectedDay(fetchedEndDate);
    }
  }, [rangeData]);

  // Generate date options between startDate and endDate
  useEffect(() => {
    if (startDate && endDate) {
      function getDatesBetween(startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);
        let dayIndex = 1;

        while (currentDate <= new Date(endDate)) {
          let formattedDate = currentDate.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
          dates.push({
            value: formattedDate,
            label: `Day ${dayIndex++}`, // Increment day index for each date
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
      }

      const formattedDates = getDatesBetween(startDate, endDate);

      setOptions(formattedDates);
    }
  }, [startDate, endDate]);

  // Fetch ventilation data based on selectedDay
  const { data, isLoading, error } = useQuery(
    ["ventData", patientId, selectedDay],
    () => fetchVentilationData(patientId, selectedDay),
    { keepPreviousData: true, enabled: !!selectedDay }
  );

  if (isLoadingRange) return <Skeleton active />;
  if (errorRange) return <div>Error loading date range.</div>;

  if (isLoading) return <Skeleton active />;
  if (error) return <div>Error loading ventilation data.</div>;

  // Define table columns
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
      render: (text) => new Date(text).toLocaleString(),
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

  const handleChange = (value) => {
    setSelectedDay(value);
  };

  // Create a new Date object with the given date string
  const date = new Date(selectedDay);

  // Options for formatting the date
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the date to a readable string
  const readableDate = date.toLocaleDateString("en-US", dateOptions);

  return (
    <PageLayout
      patientId={patientId}
      startDate={startDate}
      endDate={endDate}
      breadcrumbItems={["Ventilation"]}
    >
      <>
        <Row
          className="flex justify-between"
          gutter={[16, 16]}
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Select
              value={selectedDay}
              style={{ width: 200 }}
              onChange={handleChange}
              options={options}
            />
          </Col>
          <Col>
            <Segmented
              options={["Observation", "Setting"]}
              onChange={(value) => {
                console.log(value); // string
              }}
            />
          </Col>
        </Row>

        <Tag className="mt-2 mb-3 text-lg	" color="orange">
          {readableDate}
        </Tag>
        <Table
          columns={columns}
          dataSource={data?.data}
          rowKey="subject_id"
          pagination={{ pageSize: 10 }}
        />
      </>
    </PageLayout>
  );
};

export default VentilationPage;
