import { Avatar } from "antd";
import React from "react";

const SegmentOption = ({ icon, color, label, value }) => (
  <div className="flex flex-col items-center p-1 w-20">
    <Avatar className={`bg-${color}-500`} icon={icon} />
    <div className="mt-1 text-sm font-medium">{label}</div>
  </div>
);

export default SegmentOption;
