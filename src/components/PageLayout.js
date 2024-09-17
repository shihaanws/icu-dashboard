import React from "react";
import { Layout, Menu, Breadcrumb, theme } from "antd";
import {
  DeploymentUnitOutlined,
  ExperimentOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

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

  // Define the sidebar menu items
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

  // Determine the active menu item based on the current path
  const getSelectedKey = () => {
    if (location.pathname.includes("/neurology")) return "2";
    if (location.pathname.includes("/labs")) return "3";
    if (location.pathname.includes("/ventilation")) return "4";
    return "1"; // Default to Home if no match
  };

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          //   items={items1}
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
