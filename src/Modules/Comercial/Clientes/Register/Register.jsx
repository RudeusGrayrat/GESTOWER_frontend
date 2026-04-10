import { useEffect, useState } from "react";
import FormOne from "./FormOne";
import Permissions from "./Permissions";
import { useAuth } from "../../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../../redux/actions";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import PopUp from "../../../../recicle/popUps";

const Register = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showPermissions, setShowPermissions] = useState(true);
  const [userData, setUserData] = useState([]);
  const [form1, setForm1] = useState(null);
  const [form2, setForm2] = useState(null);
  const [resetForm, setResetForm] = useState(false);
  const { setErrors, response, createClient } = useAuth();

  const errorForms = useSelector((state) => state.error);
  const dispatch = useDispatch();

  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const handleShowPermissions = () => {
    setShowPermissions(!showPermissions);
  };
  useEffect(() => {
    if (form1 && form2) {
      form1["directory"] = form2;
      setUserData(form1);
    }
  }, [form1, form2]);

  const handleClosePopUp = () => {
    dispatch(setMessage("", ""));
    setShowPopUp(false);
    setErrors(null);
  };
  useEffect(() => {
    if (errorForms.message) {
      setShowPopUp(true);
    }
  }, [errorForms]);
  const register = async () => {
    try {
      if (!errorForms.message) {
        if (!form1 || !form2) {
          dispatch(setMessage("Faltan datos", "Error"));
          setShowPopUp(true);
        } else {
          await createClient(userData);
          if (response) {
            dispatch(setMessage(response, "Bien"));
            setShowPopUp(true);
          }
        }
      } else {
        dispatch(setMessage("Ocurrió un problema", "Error"));
        setShowPopUp(true);
      }
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    }
  };

  return (
    <div className="flex flex-col justify-center w-full p-6">
      {showPopUp && <PopUp onClose={handleClosePopUp} message={errorForms} />}

      <ButtonOk
        type="ok"
        styles="ml-12 mt-8 px-8  mx-4 "
        children="Datos Básicos"
        onClick={handleShowForm}
      />
      {showForm && <FormOne setForm1={setForm1} resetForm={resetForm} />}

      <ButtonOk
        type="ok"
        styles="ml-12 mt-8 px-8  mx-4 "
        children="Directorio"
        onClick={handleShowPermissions}
      />
      {showPermissions && (
        <Permissions setForm2={setForm2} resetForm={resetForm} />
      )}

      <div className="flex justify-center ">
        <ButtonOk children="Cancelar" />
        <ButtonOk type="ok" onClick={register} children="Registrar" />
      </div>
    </div>
  );
};

export default Register;
