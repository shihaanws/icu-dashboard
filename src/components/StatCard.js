import { Card, Image, Typography, Avatar } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { fetchPatientStats } from "../api/patientData";
const { Title, Text } = Typography;
const { Meta } = Card;

function CardComp({ statValues }) {
  const {
    data: patientStatsData,
    isLoadingStats,
    errorStats,
  } = useQuery(["patientStats"], () => fetchPatientStats());

  console.log("patientStatsData", patientStatsData);
  return (
    <Card
      className="bg-slate-100"
      hoverable
      style={{
        marginBottom: "10px",
        minWidth: 400,
      }}
    >
      <Meta
        avatar={
          <Avatar
            className="w-28 h-20"
            shape="square"
            src={statValues[2]}
            size="large"
          />
        }
        title={<Text className="text-slate-500	">{statValues[0]}</Text>}
        description={
          <Title level={3} className="m-0">
            {statValues[1]}
          </Title>
        }
      />
    </Card>
  );
}

export default CardComp;
