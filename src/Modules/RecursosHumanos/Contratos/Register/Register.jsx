// Register.js
import { useEffect, useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import { setMessage } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../../../recicle/popUps";
import useValidation from "./validateRegister";
import DateOfContract from "./Contrato";
import Colaborador from "./Colaborador";
import Planilla from "./Planilla";
import { useAuth } from "../../../../context/AuthContext";
import { deepDiff } from "../../../validateEdit";

const Register = () => {
  const { createContrato, response } = useAuth();
  const dispatch = useDispatch();
  const allColaboradores = useSelector(
    (state) => state.recursosHumanos.allEmployees
  );
  const [formData, setFormData] = useState({
    typeContract: "",
    dateStart: "",
    dateEnd: "",
    colaborador: {
      _id: "",
      name: "",
      documentType: "",
      documentNumber: "",
      direccion: "",
      email: "",
      empresa: "",
      charge: "",
      sueldo: "",
    },
    // codigoSPP: "",
    // regimenPension: "",
  });
  // console.log("Form Data: ", formData);

  const { error, validateForm } = useValidation(formData);
  const findColaborador = allColaboradores.find(
    (item) => item._id === formData.colaborador._id
  );
  const findColaboradorSort = {
    _id: findColaborador?._id || "",
    direccion: findColaborador?.location.direccion || "",
    charge: findColaborador?.charge || "",
    documentNumber: findColaborador?.documentNumber || "",
    documentType: findColaborador?.documentType || "",
    email: findColaborador?.email || "",
    empresa: findColaborador?.business || "",
    name:
      findColaborador?.name.firstName + " " + findColaborador?.name.lastName ||
      "",
    sueldo: findColaborador?.sueldo || "",
  };

  const diferencia = deepDiff(findColaboradorSort, formData.colaborador);
  // console.log("Diferencia : ", diferencia);
  const onclick = async () => {
    const formIsValid = validateForm(formData);
    try {
      console.log("Form is valid: ", formIsValid);

      if (!formIsValid) {
        const newForm = {
          ...formData,
          colaborador: formData.colaborador._id,
          cargo: formData.colaborador.charge,
          sueldo: formData.colaborador.sueldo,
        };

        await createContrato(newForm);
      } else {
        dispatch(setMessage("Faltan datos", "Error"));
      }
    } catch (error) {
      dispatch(setMessage(error || error.message, "Error"));
    }
  };
  return (
    <div className="flex flex-col w-full p-6">
      <PopUp />
      <CardPlegable title="Datos del Contrato">
        <DateOfContract
          error={error}
          setFormData={setFormData}
          formData={formData}
        />
      </CardPlegable>
      <CardPlegable title="Datos del colaborador">
        <Colaborador setForm={setFormData} error={error} form={formData} />
      </CardPlegable>
      {/* {formData.typeContract !== "" &&
      formData.typeContract !== "CONTRATO PRIVADO POR LOCACIÓN DE SERVICIOS" ? (
        <CardPlegable title="Datos de fin de contrato">
          <Planilla setForm={setFormData} error={error} form={formData} />
        </CardPlegable>
      ) : null} */}
      <div>
        <ButtonOk type="ok" children="Guardar" onClick={onclick} />
      </div>
    </div>
  );
};

export default Register;
