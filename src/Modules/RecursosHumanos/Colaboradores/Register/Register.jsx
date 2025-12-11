import { useEffect, useState } from "react";
import PopUp from "../../../../recicle/popUps";
import FormOne from "./DatosBásicos/FormOne";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import { useAuth } from "../../../../context/AuthContext";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../../redux/actions";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import FormMultiple from "./ModulosPermisos/FormMultiple";
import RemoveItemAdd from "../../../../components/RemoveAdd/RemoveItemAdd";
import Ubicacion from "./DatosBásicos/Ubicacion";
import imageCloudinary from "../../../../api/cloudinaryImage";
import useValidation from "./validate";
import axios from "../../../../api/axios";

const Register = () => {
  const { signup, response } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    documentType: "",
    documentNumber: "",
    type: "COLABORADOR",
    dateOfBirth: "",
    dateStart: "",
    genre: "",
    phone: "",
    telephone: "",
    civilStatus: "",
    email: "",
    asistenciaAutomatica: "NO",
    location: {
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",
    },
    business: "",
    sede: "",
    charge: "",
    funcion: "",
    sueldo: "",
    user: "",
    photo: "",
    password: "",
    regimenPension: "",
    codigoSPP: "",
    modules: [
      {
        name: "",
        submodule: {
          name: "",
          permissions: [],
        },
      },
    ],
  });

  const { error, validateForm } = useValidation(formData);
  const register = async () => {
    dispatch(setMessage("Espere por favor...", "Cargando"));
    const formIsValid = validateForm(formData);
    let pathPhoto = null; // Definirlo antes del try

    try {
      if (formIsValid) {
        const response = await imageCloudinary(formData.photo);
        if (!response) {
          dispatch(setMessage("Error subiendo la imagen", "Error"));
          return;
        }
        pathPhoto = response.secure_url;
        dispatch(setMessage(pathPhoto, "Cargando"));
        await signup({ ...formData, photo: pathPhoto });
      } else {
        dispatch(setMessage("Faltan datos", "Error"));
      }
    } catch (error) {
      dispatch(setMessage(error, "Error"));
      if (pathPhoto && pathPhoto.public_id) {
        await axios.delete("/deleteDocument", {
          data: { public_id: pathPhoto.public_id },
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      <PopUp />
      <CardPlegable title="Datos del Colaborador">
        <FormOne setForm={setFormData} error={error} form={formData} />
        <div className=" flex flex-col mx-3  pl-12">
          <label
            className={`text-base font-medium ${error.funcion ? "text-red-500" : "text-gray-700"
              }`}
          >
            Función
          </label>
          <textarea
            label="Función"
            className="mt-1 py-2 border px-3 w-[60%] !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            name="funcion"
            value={formData.funcion}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, funcion: e.target.value }))
            }
          />
        </div>
      </CardPlegable>
      <CardPlegable title="Ubicación">
        <Ubicacion setForm={setFormData} error={error} form={formData} />
      </CardPlegable>
      <CardPlegable title="Permisos">
        <RemoveItemAdd
          ItemComponent={FormMultiple}
          data="modules"
          estilos=" flex justify-center items-center"
          directory={formData.modules}
          setForm={setFormData}
          error={error}
        />
      </CardPlegable>

      <div className="flex justify-center ">
        <ButtonOk
          type="ok"
          onClick={register}
          classe="!w-32"
          children="Registrar"
        />
        <ButtonOk
          children="Cancelar"
          classe="!w-32"
          onClick={() => setResetForm(true)}
        />
      </div>
    </div>
  );
};

export default Register;
