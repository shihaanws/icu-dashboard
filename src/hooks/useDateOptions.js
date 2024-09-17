import { useEffect, useState } from 'react';
import { getDatesBetween } from '../utils/dateUtils';

export const useDateOptions = (startDate, endDate) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      const formattedDates = getDatesBetween(startDate, endDate);
      setOptions(formattedDates);
    }
  }, [startDate, endDate]);

  return options;
};
