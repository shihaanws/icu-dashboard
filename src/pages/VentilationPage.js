import { Col, Row, Segmented, Select, Skeleton, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDateRange, fetchVentilationData } from "../api/patientData";
import DateTag from "../components/DateTag";
import PageLayout from "../components/PageLayout";
import SegmentOption from "../components/SegmentOption";
import { formatDateTime, getDatesBetween } from "../utils/dateUtils";
import { useQuery } from "react-query";
import { SettingOutlined, MonitorOutlined } from "@ant-design/icons";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useDateOptions } from "../hooks/useDateOptions";
import { useDataFetch } from "../hooks/useDataFetch";

const VentilationPage = () => {
  const { patientId } = useParams();

  const { data: rangeData, isLoading: isLoadingRange } = useDataFetch(
    "rangeData",
    fetchDateRange,
    [patientId, "ventilation"]
  );

  // const {
  //   data: rangeData,
  //   isLoading: isLoadingRange,
  //   error: errorRange,
  // } = useQuery(["ventRange", patientId], () =>
  //   fetchDateRange(patientId, "ventilation")
  // );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [ventilationType, setVentilationType] = useState("setting");
  const [loader, setLoader] = useState(true);

  const columns = [
    { title: "Patient ID", dataIndex: "subject_id", key: "subject_id" },
    { title: "Admission ID", dataIndex: "stay_id", key: "stay_id" },
    {
      title: "Assessment Time",
      dataIndex: "charttime",
      key: "charttime",
      render: (text) => formatDateTime(text),
    },
    { title: "Observation Type", dataIndex: "label", key: "label" },
    { title: "Observation Result", dataIndex: "value", key: "value" },
  ];

  // Update state when date range data is fetched
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

  const { data: ventData, isLoading } = useDataFetch(
    "ventData",
    fetchVentilationData,
    [patientId, selectedDay, ventilationType]
  );

  useEffect(() => {
    if (ventData) setLoader(false);
  }, [ventData]);

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };

  return (
    <PageLayout
      patientId={patientId}
      startDate={startDate}
      endDate={endDate}
      breadcrumbItems={["Ventilation"]}
    >
      {isLoading || loader ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Row className="flex justify-between" gutter={[16, 16]}>
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
            <Col>
              <DateTag date={selectedDay} />
            </Col>
            <Col>
              <Segmented
                options={[
                  {
                    label: (
                      <SegmentOption
                        icon={<SettingOutlined />}
                        color="blue"
                        label="Setting"
                      />
                    ),
                    value: "setting",
                  },
                  {
                    label: (
                      <SegmentOption
                        icon={<MonitorOutlined />}
                        color="green"
                        label="Observation"
                      />
                    ),
                    value: "observation",
                  },
                ]}
                onChange={setVentilationType}
              />
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={ventData?.data}
            rowKey="subject_id"
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
    </PageLayout>
  );
};

export default VentilationPage;
