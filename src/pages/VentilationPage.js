import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Col, Row, Select, Segmented, Table } from "antd";
import { MonitorOutlined, SettingOutlined } from "@ant-design/icons";

import { useDataFetch } from "../hooks/useDataFetch";
import { useDateOptions } from "../hooks/useDateOptions";
import { fetchDateRange, fetchVentilationData } from "../api/patientData";
import { formatDateTime } from "../utils/dateUtils";

import PageLayout from "../components/PageLayout";
import SegmentOption from "../components/SegmentOption";
import DateTag from "../components/DateTag";
import LoadingSkeleton from "../components/LoadingSkeleton";

const VentilationPage = () => {
  const { patientId } = useParams();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [ventilationType, setVentilationType] = useState("setting");
  const [loader, setLoader] = useState(true);

  const { data: rangeData, isLoading: isLoadingRange } = useDataFetch(
    "rangeData",
    fetchDateRange,
    [patientId, "ventilation"]
  );

  const { data: ventData, isLoading } = useDataFetch(
    "ventData",
    fetchVentilationData,
    [patientId, selectedDay, ventilationType]
  );

  useEffect(() => {
    if (rangeData?.data) {
      const fetchedStartDate = rangeData.data.start_time?.slice(0, 10);
      const fetchedEndDate = rangeData.data.end_time?.slice(0, 10);
      setStartDate(fetchedStartDate);
      setEndDate(fetchedEndDate);
      setSelectedDay(fetchedEndDate);
    }
  }, [rangeData]);

  useEffect(() => {
    if (ventData) setLoader(false);
  }, [ventData]);

  const options = useDateOptions(startDate, endDate);

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };

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
