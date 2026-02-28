import { useEffect, useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import RegisterBoletaDePagos from "../Register/Register";
import { useDispatch, useSelector } from "react-redux";
import {
  getBoletaDePagos,
  getEmployees,
  setMessage,
} from "../../../../redux/actions";
import { useAuth } from "../../../../context/AuthContext";
import { deepDiff } from "../../../validateEdit";
import dayjs from "dayjs";

const EditBoletaDePagos = ({ setShowEdit, selected, reload }) => {
  const dispatch = useDispatch();
  const colaboradores = useSelector((state) => state.recursosHumanos.allEmployees);

  useEffect(() => {
    if (colaboradores.length === 0) dispatch(getEmployees());
  }, [colaboradores]);
  const { updateBoletasDePago } = useAuth();
  const colaboradorName =
    selected?.colaborador?.lastname + " " + selected?.colaborador?.name;
  const [form, setForm] = useState({
    ...selected,
    colaborador: colaboradorName,
    fechaBoletaDePago: selected?.fechaBoletaDePago
      ?.split("/")
      .reverse()
      .join("-"),
  });
  const [formEdit, setFormEdit] = useState({});

  const changes = deepDiff(form, formEdit);

  const upDate = async () => {
    try {
      if (Object.keys(changes).length === 0) {
        dispatch(setMessage("No hay cambios", "Error"));
        return;
      } else {
        let newForm = {
          _id: form._id,
          ...changes,
        };
        if (changes.fechaBoletaDePago) {
          newForm.fechaBoletaDePago = dayjs(changes.fechaBoletaDePago).format(
            "MM/YYYY"
          );
        }
        if (changes.colaborador) {
          const findChangecolaborador = colaboradores.find(
            (colaborador) =>
              colaborador?.lastname + " " + colaborador?.name ===
              changes.colaborador
          );
          newForm.colaborador = findChangecolaborador._id;
        }
        await updateBoletasDePago(newForm);
        dispatch(getBoletaDePagos());
      }
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    } finally {
      reload();
    }
  };
  return (
    <Edit setShowEdit={setShowEdit} upDate={upDate}>
      <RegisterBoletaDePagos
        formInitial={form}
        descuentoInitial={form?.descuentosAlTrabajador}
        aporteinitial={form?.aportacionesDelEmpleador}
        setFormEdit={setFormEdit}
      />
    </Edit>
  );
};

export default EditBoletaDePagos;
