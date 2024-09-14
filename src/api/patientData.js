import axios from "axios";

export const fetchPatientList = async (pageNumber) => {
  //   const { data } = await axios.get(`/api/patients?page=${page}`);
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/misc/allStays?page_number=${pageNumber}&num_entries=10`
  );
  return data;
};

export const fetchPatientStats = async () => {
  //   const { data } = await axios.get(`/api/patients?page=${page}`);
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/misc/ICUStaysStatistics`
  );
  return data;
};

export const fetchNeurologyData = async (patientId, selectedDay) => {
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/neurology?type=Orientation&date=${selectedDay}&stay_id=${patientId}`
  );
  return data;
};

export const fetchLabsData = async (patientId, date) => {
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/labs/?stay_id=${patientId}&date=${date}`
  );
  return data;
};

export const fetchVentilationData = async (patientId, date) => {
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/ventilation/?type=setting&date=${date}&stay_id=${patientId}`
  );
  return data;
};

export const fetchDateRange = async (patientId, tableName) => {
  const { data } = await axios.get(
    `https://api-testing.diagna.icu/mimic/api/misc/getDateRange/?stay_id=${patientId}&table_name=${tableName}`
  );
  return data;
};
