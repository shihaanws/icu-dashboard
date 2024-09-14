import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { Segmented, Select, Skeleton, Table, Row, Col, Tag } from "antd";
import PageLayout from "../components/PageLayout";
import { fetchDateRange, fetchNeurologyData } from "../api/patientData";
import { Typography } from "antd";
const { Title, Text } = Typography;
const NeurologyPage = () => {
  const { patientId } = useParams();

  const {
    data: rangeData,
    isLoading: isLoadingRange,
    error: errorRange,
  } = useQuery(["neuroRange", patientId], () =>
    fetchDateRange(patientId, "neurology")
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (rangeData?.data) {
      setEndDate(rangeData.data.end_time?.slice(0, 10));
      setStartDate(rangeData.data.start_time?.slice(0, 10));
      setSelectedDay(rangeData.data.end_time?.slice(0, 10));
    }
  }, [rangeData]);

  const [selectedDay, setSelectedDay] = useState(startDate);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    console.log("rangeData", rangeData, startDate, endDate);
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

    console.log(formattedDates);
    console.log("formattedDates", formattedDates);
    setOptions(formattedDates);
  }, [startDate, endDate]);

  const { data, isLoading, error } = useQuery(
    ["neuroData", patientId, selectedDay],
    () => fetchNeurologyData(patientId, selectedDay),
    { keepPreviousData: true, enabled: !!selectedDay }
  );

  if (isLoadingRange) return <Skeleton active />;
  if (errorRange) return <div>Error loading date range.</div>;

  if (isLoading) return <Skeleton active />;
  if (error) return <div>Error loading neurology data.</div>;

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

  console.log(readableDate); // Outputs: November 17, 2171

  const handleChange = (value) => {
    setSelectedDay(value);
    console.log("valuef", value);
  };

  return (
    <PageLayout
      patientId={patientId}
      startDate={startDate}
      endDate={endDate}
      breadcrumbItems={["Neurology"]}
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
              options={["GCS", "Pupil", "Strength", "Orientation"]}
              onChange={(value) => {
                console.log(value);
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

export default NeurologyPage;
