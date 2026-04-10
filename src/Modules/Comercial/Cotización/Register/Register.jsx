import { useEffect, useState } from "react";
import PopUp from "../../../../recicle/popUps";
import { useAuth } from "../../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { getClients, setMessage } from "../../../../redux/actions";
import SearchClient from "./Search";
import FormOne from "./DatosDocumento/FormOne";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Registros from "./Registros/Registros";
import FormMultiple from "./DatosContacto/FormMultiple";
import MontosFinales from "./MontosFinales/Montosfinales";
import dayjs from "dayjs";
import { montosFinales } from "../validateCotizacion";
import ButtonOk from "../../../../recicle/Buttons/Buttons";

const Register = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getClients());
  }, []);
  const Allclients = useSelector((state) => state.clients);
  const clients = Allclients.map((client) => {
    return {
      name: client.razonSocial,
      ...client,
    };
  });
  const [errorInputs, setErrorInputs] = useState({
    datosDocumentos: false,
    datosContacto: false,
    registros: false,
  });
  const [resetForm, setResetForm] = useState(false);
  const { setErrors, response, createCotizacion, setResponse } = useAuth();
  const [clientSelected, setClientSelected] = useState("");
  const [contization, setContization] = useState({
    fechaOperacion: dayjs().format("DD/MM/YYYY"),
  });
  const errorForms = useSelector((state) => state.error);
  const [formRegistro, setFormRegistro] = useState([]);
  useEffect(() => {
    if (formRegistro.length > 0) {
      setContization((prevData) => ({
        ...prevData,
        registros: formRegistro,
      }));
      setErrorInputs((prevData) => ({
        ...prevData,
        registros: false,
      }));
    } else {
      setErrorInputs((prevData) => ({
        ...prevData,
        registros: true,
      }));
    }
  }, [formRegistro]);
  const handleClosePopUp = () => {
    dispatch(setMessage("", ""));
    setShowPopUp(false);
    setResponse(null);
    setErrors(null);
  };
  useEffect(() => {
    if (errorForms.message) {
      setShowPopUp(true);
    }
  }, [errorForms]);
  const validateMontosFinales = montosFinales(contization);
  const register = async () => {
    try {
      if (!errorForms.message) {
        if (
          Object.values(errorInputs).some(Boolean) ||
          Object.keys(validateMontosFinales).length > 0
        ) {
          dispatch(setMessage("Faltan datos", "Error"));
        } else {
          await createCotizacion(contization);
          if (response) {
            dispatch(
              setMessage(
                `Esta es la correlativa: ${response}`,
                "Creado Coreectamente"
              )
            );
            setShowPopUp(true);
          }
        }
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col w-full p-6">
      {showPopUp && <PopUp onClose={handleClosePopUp} message={errorForms} />}
      <SearchClient
        clientSelected={clientSelected}
        setClientSelected={setClientSelected}
        options={clients}
      />
      <CardPlegable
        children={
          <FormOne
            form1={contization}
            setErrorForm={setErrorInputs}
            setForm1={setContization}
            resetForm={resetForm}
            clientSelected={clientSelected}
            clients={clients}
          />
        }
        title="Datos de Documento"
      />
      <CardPlegable
        title="Datos de Contacto"
        children={
          <FormMultiple
            setErrorForm={setErrorInputs}
            directorio={clientSelected.directory}
            set={setContization}
          />
        }
      />
      <CardPlegable
        title="Otros Datos"
        children={
          <textarea
            value={contization.othersData || ""}
            onChange={(e) =>
              setContization({ ...contization, othersData: e.target.value })
            }
            className="w-[80%] min-h-24 border rounded-lg ml-8 mt-4 p-3 
              focus:outline-none focus:border-indigo-500"
          ></textarea>
        }
      />
      <CardPlegable
        title="Obrservaciones"
        children={
          <textarea
            value={contization.observaciones || ""}
            onChange={(e) =>
              setContization({
                ...contization,
                observaciones: e.target.value,
              })
            }
            className="w-[80%] min-h-24 border rounded-lg ml-8 mt-4 p-3 
              focus:outline-none focus:border-indigo-500"
          ></textarea>
        }
      />
      <CardPlegable title="Registros">
        <Registros setForm={setFormRegistro} setErrorForm={setErrorInputs} />
      </CardPlegable>

      <CardPlegable
        title="Montos Finales"
        children={
          <MontosFinales
            registro={formRegistro}
            cotizacion={contization}
            set={setContization}
          />
        }
      />

      <div className="flex justify-center ">
        <ButtonOk children="Cancelar" onClick={() => setResetForm(true)} />
        <ButtonOk type="ok" onClick={register} children="Registrar" />
      </div>
    </div>
  );
};

export default Register;
