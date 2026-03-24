import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../context/AuthContext";
import { setMessage } from "../../../../redux/actions";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import FormOne from "../Register/DatosBásicos/FormOne";
import useValidation from "../Register/validate";
import Edit from "../../../../components/Principal/Permissions/Edit";
import Ubicacion from "../Register/DatosBásicos/Ubicacion";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import FormMultiple from "../Register/ModulosPermisos/FormMultiple";
import { deepDiff } from "../../../validateEdit";
import { validateModules, validateSubModules } from "./validateSubModule";
import imageCloudinary from "../../../../api/cloudinaryImage";
import axios from "../../../../api/axios";
import { getEmployees } from "../../../../redux/modules/Recursos Humanos/actions";

const EditEmployee = ({ setShowEdit, selected, reload }) => {
  const { updateEmployee } = useAuth();
  const dispatch = useDispatch();

  const [edition, setEdition] = useState({
    ...selected,
    password: "",
  });

  const formFinal = deepDiff(selected, edition);

  const diferenciaModules = validateModules(selected.modules, edition.modules);
  const validateSubModule = validateSubModules(formFinal?.modules);
  const cleanEmptyObjects = (modules) => {
    return modules.filter(
      (module) =>
        Object.keys(module).length > 0 &&
        (module.name || module.submodule || module.permissions?.length)
    );
  };
  useEffect(() => {
    setEdition((prev) => ({
      ...prev,
      modules: cleanEmptyObjects(prev.modules),
    }));
  }, [Object.keys(diferenciaModules).length > 0]);

  const { error } = useValidation(edition);

  const upDate = async () => {
    dispatch(setMessage("Cargando...", "Espere", true));
    let pathPhoto = null;

    try {
      if (Object.keys(formFinal).length === 0) {
        return dispatch(setMessage("No se han realizado cambios", "Error"));
      }

      if (Object.keys(validateSubModule).length > 0) {
        return dispatch(setMessage("Hay un Submódulo repetido", "Error"));
      }
      let form = { ...formFinal };

      if (formFinal.photo) {
        const response = await imageCloudinary(formFinal.photo);
        if (!response)
          return dispatch(setMessage("Error subiendo la imagen", "Error"));
        if (response.error)
          return dispatch(setMessage("Error subiendo la imagen", "Error"));
        pathPhoto = response;
        form.photo = response.secure_url;
      }
      await updateEmployee({ ...form, _id: selected._id });
      dispatch(getEmployees());
    } catch (error) {
      await axios.delete("/deleteDocument", {
        data: { public_id: pathPhoto.public_id },
      });
      dispatch(setMessage("Error en la actualización", "Error"));
    } finally {
      reload();
    }
  };

  return (
    <Edit setShowEdit={setShowEdit} upDate={upDate}>
      <CardPlegable title="Datos del Colaborador">
        <FormOne error={error} setForm={setEdition} form={edition} />
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
            value={edition.funcion}
            onChange={(e) =>
              setEdition((prev) => ({ ...prev, funcion: e.target.value }))
            }
          />
        </div>
      </CardPlegable>
      <CardPlegable title="Ubicaión">
        <Ubicacion error={error} setForm={setEdition} form={edition} />
      </CardPlegable>
      <CardPlegable title="Módulos">
        <Directorio
          data="modules"
          estilos=" flex justify-center items-center"
          ItemComponent={FormMultiple}
          directory={edition.modules}
          setForm={setEdition}
          error={error}
        />
      </CardPlegable>
    </Edit>
  );
};

export default EditEmployee;
