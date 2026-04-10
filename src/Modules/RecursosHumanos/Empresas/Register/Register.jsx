import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  consultRuc,
  getEmployees,
  setMessage,
} from "../../../../redux/actions.js";
import { useAuth } from "../../../../context/AuthContext.jsx";
import PopUp from "../../../../recicle/popUps.jsx";
import ButtonOk from "../../../../recicle/Buttons/Buttons.jsx";
import imageCloudinary from "../../../../api/cloudinaryImage.jsx";
import CardPlegable from "../../../../recicle/Divs/CardPlegable.jsx";
import DatosEmpresa from "./Empresa.jsx";
import Representante from "./Representante.jsx";
import useValidation from "../validateEmpresas.js";
import axios from "../../../../api/axios.js";

const Register = () => {
  const { postBusiness, response } = useAuth();
  const [deshabilitar, setDeshabilitar] = useState(false);
  const [form, setForm] = useState({
    ruc: "",
    razonSocial: "",
    domicilioFiscal: "",
    logo: "",
    representative: {
      name: "",
      documentType: "",
      documentNumber: "",
      signature: "",
    },
  });

  const responseRuc = useSelector((state) => state.recursosHumanos.ruc);
  const colaboradores = useSelector((state) => state.recursosHumanos.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    if (colaboradores.length === 0) dispatch(getEmployees());
  }, [colaboradores]);

  useEffect(() => {
    if (form.ruc.length === 11) {
      dispatch(consultRuc(form.ruc));
    } else {
      setForm((prevData) => ({
        ...prevData,
        razonSocial: "",
      }));
    }
  }, [form.ruc]);

  useEffect(() => {
    if (responseRuc?.razonSocial) {
      setForm((prevData) => ({
        ...prevData,
        razonSocial: responseRuc.razonSocial,
      }));
    }
  }, [responseRuc]);

  const { error, validateForm } = useValidation(form);

  const enviar = async () => {
    dispatch(setMessage("Cargando...", "Espere"));
    setDeshabilitar(true);
    let pathLogo = null;
    let pathSignature = null;
    try {
      const formIsValid = validateForm(form);

      if (formIsValid) {
        pathLogo = await imageCloudinary(form.logo);
        pathSignature = await imageCloudinary(form.representative.signature);
        const newForm = {
          ...form,
          logo: pathLogo.secure_url,
          representative: {
            ...form.representative,
            signature: pathSignature.secure_url,
          },
        };
        await postBusiness(newForm);
        if (response) {
          dispatch(setMessage(response, "Ok"));
        }
      } else {
        dispatch(setMessage("Faltan datos", "Error"));
      }
    } catch (error) {
      dispatch(setMessage(error, "Error"));
      if (pathLogo && pathLogo.public_id) {
        await axios.delete("/deleteDocument", {
          data: { public_id: pathLogo.public_id },
        });
      }
      if (pathSignature && pathSignature.public_id) {
        await axios.delete("/deleteDocument", {
          data: { public_id: pathSignature.public_id },
        });
      }
    } finally {
      setDeshabilitar(false);
      dispatch(setMessage("", ""));
    }
  };

  return (
    <div className="flex flex-col">
      <PopUp disabled={deshabilitar} />
      <CardPlegable title="Datos de la Empresa">
        <DatosEmpresa error={error} setForm={setForm} form={form} />
      </CardPlegable>
      <CardPlegable title="Datos del Representante">
        <Representante error={error} setForm={setForm} form={form} />
      </CardPlegable>
      <div className="flex justify-center">
        <ButtonOk children="Cancelar" />
        <ButtonOk children="Enviar" onClick={enviar} type="ok" />
      </div>
    </div>
  );
};

export default Register;
