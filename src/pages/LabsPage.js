import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Select, Skeleton, Table, Row, Col, Tag } from "antd";
import PageLayout from "../components/PageLayout";
import { fetchDateRange, fetchLabsData } from "../api/patientData";
import { formatDateTime, getDatesBetween } from "../utils/dateUtils";
import DateTag from "../components/DateTag";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useDateOptions } from "../hooks/useDateOptions";
import { useDataFetch } from "../hooks/useDataFetch";

const LabsPage = () => {
  const { patientId } = useParams();

  const { data: rangeData, isLoading: isLoadingRange } = useDataFetch(
    "labsRange",
    fetchDateRange,
    [patientId, "labs"]
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loader, setLoader] = useState(true);

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "subject_id",
      key: "subject_id",
    },
    {
      title: "Admission ID",
      dataIndex: "stay_id",
      key: "stay_id",
    },
    {
      title: "Chart Time",
      dataIndex: "charttime",
      key: "charttime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Test Name",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Result (Unit)",
      key: "result",
      render: (text, record) => `${record.value} ${record.valueuom || "N/A"}`,
    },
  ];

  useEffect(() => {
    if (rangeData?.data) {
      const fetchedStartDate = rangeData.data.start_time?.slice(0, 10);
      const fetchedEndDate = rangeData.data.end_time?.slice(0, 10);
      setStartDate(fetchedStartDate);
      setEndDate(fetchedEndDate);
      setSelectedDay(fetchedEndDate);
    }
  }, [rangeData]);

  const options = useDateOptions(startDate, endDate);

  const { data: labsData, isLoading } = useDataFetch(
    "labsData",
    fetchLabsData,
    [patientId, selectedDay]
  );

  useEffect(() => {
    if (labsData) {
      setLoader(false);
    }
  }, [labsData]);

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };
  return (
    <PageLayout
      patientId={patientId}
      startDate={startDate}
      endDate={endDate}
      breadcrumbItems={["Labs"]}
    >
      {isLoading || loader ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col>
              <Select
                value={selectedDay}
                style={{ width: 200 }}
                onChange={handleDayChange}
                options={options}
              />
            </Col>
          </Row>

          <Row className="flex justify-between mb-2 items-end">
            <DateTag date={selectedDay} />
          </Row>

          <Table
            columns={columns}
            dataSource={labsData?.data}
            rowKey="subject_id"
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
    </PageLayout>
  );
};

export default LabsPage;
