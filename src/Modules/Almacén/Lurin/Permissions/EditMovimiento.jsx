import { useEffect, useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "../Register/DatosBasicos";
import DatosGenerales from "../Register/DatosGenerales";
import DescripcionDeBienes from "../Register/DescripcionDeBienes";
import Otros from "../Register/Otros";
import useValidation from "../Register/Validate";
import useSendMessage from "../../../../recicle/senMessage";
import { useSelector } from "react-redux";
import { deepDiff } from "../../../validateEdit";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";

const EditMovimiento = ({ setShowEdit, selected, reload }) => {
  const idSelected = selected._id;
  const { user } = useAuth();

  const [formInicial] = useState({
    ...selected,
    contrato: selected.contratoId?.cliente || "",
  });

  const [form, setForm] = useState(formInicial);
  console.log("🚀 ~ file: EditMovimiento.jsx:24 ~ EditMovimiento ~ form:", form)
  const contratos = useSelector((state) => state.almacen.allContratos);

  const contratoSede = contratos.filter(
    (contrato) => contrato.sedeId?.nombre === "LURIN"
  );

  const contratoOptions = contratoSede.map((c) => c.cliente);

  const sendMessage = useSendMessage();
  const { error } = useValidation(form);

  const diferencias = deepDiff(formInicial, form);
  console.log("🚀 ~ file: EditMovimiento.jsx:35 ~ EditMovimiento ~ diferencias:", diferencias)
  const actualizar = async () => {
    try {
      if (Object.keys(diferencias).length === 0) {
        sendMessage("No se realizaron cambios", "Info");
        return;
      }
      await axios.patch("/patchMovimientoAlmacen", {
        _id: idSelected,
        actualizadoPor: user._id,
        ...diferencias,
      });

      sendMessage("Movimiento actualizado correctamente", "Bien");
    } catch (error) {
      sendMessage(
        error?.response?.data?.message ||
        error.message ||
        "Error al actualizar el movimiento",
        "Error"
      );
    } finally {
      setShowEdit(false);
      reload();
    }
  };

  return (
    <Edit setShowEdit={setShowEdit} upDate={actualizar}>
      <CardPlegable title="Datos Básicos">
        <DatosBasicos
          form={form}
          setForm={setForm}
          contratoOptions={contratoOptions}
          error={error}
        />
      </CardPlegable>

      <CardPlegable title="Datos Generales">
        <DatosGenerales form={form} setForm={setForm} error={error} />
      </CardPlegable>

      <CardPlegable title="Descripción de los Bienes Involucrados">
        <Directorio
          ItemComponent={DescripcionDeBienes}
          data="descripcionBienes"
          estilos="flex justify-center items-center"
          directory={form.descripcionBienes}
          sendMessage={sendMessage}
          setForm={setForm}
          error={error}
        />
      </CardPlegable>

      <CardPlegable title="Otros">
        <Otros form={form} setForm={setForm} error={error} />
      </CardPlegable>
    </Edit>
  );
};

export default EditMovimiento;