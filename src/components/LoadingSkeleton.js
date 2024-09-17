import { Skeleton } from "antd";

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
