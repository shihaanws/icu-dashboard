import {
  DeploymentUnitOutlined,
  ExperimentOutlined,
  RobotOutlined,
  HeartbeatOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Typography } from "antd";
const { Title } = Typography;

const { Header, Content, Footer, Sider } = Layout;

const PageLayout = ({
  children,
  breadcrumbItems,
  patientId,
  startDate,
  endDate,
  landingPageMode,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  const items2 = [
    {
      key: "2",
      icon: <DeploymentUnitOutlined />,
      label: <Link to={`/patient/${patientId}/neurology`}>Neurology</Link>,
    },
    {
      key: "3",
      icon: <ExperimentOutlined />,
      label: <Link to={`/patient/${patientId}/labs`}>Labs</Link>,
    },
    {
      key: "4",
      icon: <RobotOutlined />,
      label: <Link to={`/patient/${patientId}/ventilation`}>Ventilation</Link>,
    },
  ];

  const getSelectedKey = () => {
    if (location.pathname.includes("/neurology")) return "2";
    if (location.pathname.includes("/labs")) return "3";
    if (location.pathname.includes("/ventilation")) return "4";
    return "1";
  };

  return (
    <Layout>
      <Header className="flex items-center">
        <div className="demo-logo flex items-center" />
        <img src="/icu_logo.png" width={50} />
        <Title level={3} className="!text-slate-50 text-center !m-1 font-sans">
          ICU Insight
        </Title>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to={`/patients`}>Home </Link>
          </Breadcrumb.Item>
          {breadcrumbItems?.map((item, index) => (
            <Breadcrumb.Item key={index}>
              <Link
                to={`/patient/${patientId}/${startDate}/${endDate}/${item}`}
              >
                {item}
              </Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            hidden={landingPageMode}
            width={200}
            style={{ background: colorBgContainer }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              style={{ height: "100%" }}
              items={items2}
            />
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default PageLayout;
