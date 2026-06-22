import axios from "../../../api/axios";

const create_Employee = async (employee, setResponse, setErrors) => {
  try {
    const response = await axios.post("/registerEmployee", employee);
    const data = response.data;
    setResponse(data.message);
  } catch (error) {
    setErrors(
      error?.response?.data?.message?._message || error?.response?.data?.message
    );
  }
};

const update_Employee = async (employee, setResponse, setErrors) => {
  try {
    const response = await axios.patch("/patchEmployee", employee);
    const data = response.data;
    setResponse(data.message);
    return data;
  } catch (error) {
    setErrors(error?.response?.data?.message);
  }
};

export { create_Employee, update_Employee };
