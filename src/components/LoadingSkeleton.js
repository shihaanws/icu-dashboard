import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";

const LoadingSkeleton = () => (
  <>
    <Skeleton.Input active />
    <br />
    <br />
    <br />
    <Skeleton
      paragraph={{
        rows: 6,
      }}
      active
    />
  </>
);

export default LoadingSkeleton;
