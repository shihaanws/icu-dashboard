import React from 'react';
import { Tag } from 'antd';

const DateTag = ({ date }) => {
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const readableDate = new Date(date).toLocaleDateString("en-US", dateOptions);

  return <Tag className="mt-2 text-lg flex items-center h-[30px]" color="orange">{readableDate}</Tag>;
};

export default DateTag;
