import axios from "../../../api/axios";

const create_AsistenciaColaborador = async (
  AsistenciaColaborador,
  setResponse,
  setErrors
) => {
  try {
    const response = await axios.post(
      "/postAsistenciaErp",
      AsistenciaColaborador
    );
    const data = response.data;
    setResponse(data.message);
  } catch (error) {
    setErrors(
      error?.response?.data?.message?._message || error?.response?.data?.message
    );
  }
};

const update_AsistenciaColaborador = async (
  AsistenciaColaborador,
  setResponse,
  setErrors
) => {
  try {
    const response = await axios.patch(
      "/patchAsistenciaColaborador",
      AsistenciaColaborador
    );
    const data = response.data;
    setResponse(data.message);
    return data;
  } catch (error) {
    setErrors(error?.response?.data?.message);
  }
};
const delete_AsistenciaColaborador = async (id, setResponse, setErrors) => {
  try {
    const response = await axios.delete("/deleteAsistenciaColaborador", {
      data: { _id: id },
    });
    const data = response.data;
    setResponse(data.message);
    return data;
  } catch (error) {
    setErrors(error?.response?.data?.message);
  }
};

export {
  create_AsistenciaColaborador,
  update_AsistenciaColaborador,
  delete_AsistenciaColaborador,
};
