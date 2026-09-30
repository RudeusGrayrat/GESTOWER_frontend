import { useEffect, useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../context/AuthContext";
import useValidation from "../validateEmpresas";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import { deepDiff } from "../../../validateEdit";
import DatosEmpresa from "../Register/Empresa";
import Representante from "../Register/Representante";
import { getBusiness } from "../../../../redux/modules/Recursos Humanos/actions";
import useSendMessage from "../../../../recicle/senMessage";

const EditBusiness = ({ setShowEdit, selected, reload }) => {
  const _id = selected._id;
  const [form, setForm] = useState({ ...selected });
  const { updateBusiness, response } = useAuth();
  const dispatch = useDispatch();
  const { error } = useValidation();
  const [hasChanges, setHasChanges] = useState({});
  useEffect(() => {
    setHasChanges(deepDiff(selected, form));
  }, [form, selected]);
  const sendMessage = useSendMessage();
  const upDate = async () => {
    sendMessage("Cargando cambios...", "Info");
    if (!hasChanges) return sendMessage("No hay cambios", "Error!!");
    const upDateForm = {
      ...hasChanges,
      _id,
    };
    try {
      await updateBusiness(upDateForm);
      dispatch(getBusiness());
    } catch (error) {
      sendMessage(error.message, "Error!!");
    } finally {
      reload();
      setShowEdit(false);
    }
  };

  return (
    <Edit setShowEdit={setShowEdit} upDate={upDate}>
      <PopUp />
      <CardPlegable title="Datos de la Empresa">
        <DatosEmpresa form={form} setForm={setForm} error={error} />
      </CardPlegable>
      <CardPlegable title="Datos del Representante">
        <Representante form={form} setForm={setForm} error={error} />
      </CardPlegable>
    </Edit>
  );
};

export default EditBusiness;
