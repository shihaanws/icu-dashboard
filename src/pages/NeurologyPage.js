import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Col, Row, Select, Segmented, Table, Typography } from "antd";
import {
  CompassOutlined,
  DashboardOutlined,
  EyeOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import { useDataFetch } from "../hooks/useDataFetch";
import { useDateOptions } from "../hooks/useDateOptions";
import { fetchDateRange, fetchNeurologyData } from "../api/patientData";
import { formatDateTime } from "../utils/dateUtils";

import PageLayout from "../components/PageLayout";
import SegmentOption from "../components/SegmentOption";
import DateTag from "../components/DateTag";
import LoadingSkeleton from "../components/LoadingSkeleton";

const NeurologyPage = () => {
  const { patientId } = useParams();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [neuroType, setNeuroType] = useState("GCS");
  const [loader, setLoader] = useState(true);

  const { data: rangeData, isLoading: isLoadingRange } = useDataFetch(
    "neuroRange",
    fetchDateRange,
    [patientId, "neurology"]
  );

  const { data: neuroData, isLoading } = useDataFetch(
    "neuroData",
    fetchNeurologyData,
    [patientId, selectedDay, neuroType],
    selectedDay !== null
  );

  useEffect(() => {
    if (rangeData?.data) {
      setStartDate(rangeData.data.start_time?.slice(0, 10));
      setEndDate(rangeData.data.end_time?.slice(0, 10));
      setSelectedDay(rangeData.data.end_time?.slice(0, 10));
    }
  }, [rangeData]);

  useEffect(() => {
    if (neuroData) {
      setLoader(false);
    }
  }, [neuroData]);

  const options = useDateOptions(startDate, endDate);

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "subject_id",
      key: "subject_id",
      render: (text) => text || "N/A",
    },
    {
      title: "Admission ID",
      dataIndex: "stay_id",
      key: "stay_id",
      render: (text) => text || "N/A",
    },
    {
      title: "Assessment Time",
      dataIndex: "charttime",
      key: "charttime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Observation Type",
      dataIndex: "label",
      key: "label",
      render: (text) => text || "N/A",
    },
    {
      title: "Observation Result",
      dataIndex: "value",
      key: "value",
      render: (text, record) =>
        record.valueuom ? `${record.value} ${record.valueuom}` : text || "N/A",
    },
  ];

  return (
    <PageLayout
      patientId={patientId}
      startDate={startDate}
      endDate={endDate}
      breadcrumbItems={["Neurology"]}
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
            <DateTag date={selectedDay} />

            <Col>
              <Segmented
                options={[
                  {
                    label: (
                      <SegmentOption
                        icon={<DashboardOutlined />}
                        color="blue"
                        label="GCS"
                        value="GCS"
                      />
                    ),
                    value: "GCS",
                  },
                  {
                    label: (
                      <SegmentOption
                        icon={<EyeOutlined />}
                        color="green"
                        label="Pupil"
                        value="Pupil"
                      />
                    ),
                    value: "Pupil",
                  },
                  {
                    label: (
                      <SegmentOption
                        icon={<ThunderboltOutlined />}
                        color="yellow"
                        label="Strength"
                        value="Strength"
                      />
                    ),
                    value: "Strength",
                  },
                  {
                    label: (
                      <SegmentOption
                        icon={<CompassOutlined />}
                        color="red"
                        label="Orientation"
                        value="Orientation"
                      />
                    ),
                    value: "Orientation",
                  },
                ]}
                onChange={setNeuroType}
              />
            </Col>
          </Row>

          <Table
            scroll={{ x: 1000 }}
            columns={columns}
            dataSource={neuroData?.data}
            rowKey="subject_id"
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
    </PageLayout>
  );
};

export default NeurologyPage;
