import { useState } from "react";
import Edit from "../../../../../components/Principal/Permissions/Edit";
import DatosDeAsistencia from "../Register/Asistencia";
import DatoDeColaborador from "../Register/Colaborador";
import useValidation from "../validateAsistenciaColaborador";
import CardPlegable from "../../../../../recicle/Divs/CardPlegable";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../../context/AuthContext";
import { deepDiff, simpleDiff } from "../../../../validateEdit";
import { setMessage } from "../../../../../redux/actions";

const EditAsistenciaColaborador = ({ setShowEdit, selected, reload }) => {
  const [form, setForm] = useState({
    ...selected,
    colaborador:
      selected.colaborador.lastname + " " + selected.colaborador.name,
  });
  const [formEdit, setFormEdit] = useState({
    ...form
  });
  const dispatch = useDispatch();
  const colaboradores = useSelector(
    (state) => state.recursosHumanos.allEmployees
  );
  const { updateAsistenciaColaborador } = useAuth();
  const { error } = useValidation();

  const updateAsistencia = async () => {
    const handleChanges = deepDiff(form, formEdit);
    try {
      if (Object.keys(handleChanges).length > 0) {
        const colaboradorId = colaboradores.find(
          (colaborador) =>
            colaborador.lastname + " " + colaborador.name === form.colaborador
        )?._id;

        if (!colaboradorId) {
          dispatch(setMessage("Colaborador no encontrado", "Error"));
          return;
        }
        const newData = {
          ...selected,
          ...handleChanges,
          colaborador: colaboradorId,
        };
        console.log("Datos a actualizar:", newData);
        await updateAsistenciaColaborador(newData);
      } else {
        dispatch(setMessage("No se realizaron cambios", "Error"));
      }
    } catch (error) {
      dispatch(setMessage(error.message || error, "Error"));
    } finally {
      reload();
    }
  };
  return (
    <Edit setShowEdit={setShowEdit} upDate={updateAsistencia}>
      <CardPlegable title="Datos de Asistencia">
        <DatosDeAsistencia setForm={setFormEdit} error={error} form={formEdit} />
      </CardPlegable>
      <CardPlegable title="Datos del Colaborador">
        <DatoDeColaborador setForm={setFormEdit} error={error} form={formEdit} />
      </CardPlegable>
    </Edit>
  );
};

export default EditAsistenciaColaborador;
