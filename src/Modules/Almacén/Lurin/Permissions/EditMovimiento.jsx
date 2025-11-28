import { useEffect, useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd copy";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import DatosBasicos from "../Register/DatosBasicos";
import DatosGenerales from "../Register/DatosGenerales";
import DescripcionDeBienes from "../Register/DescripcionDeBienes";
import Otros from "../Register/Otros";
import useValidation from "../Register/Validate";
import useSendMessage from "../../../../recicle/senMessage";
import { useSelector } from "react-redux";
import axios from "../../../../api/axios";

const EditMovimiento = ({ setShowEdit, selected }) => {
  const [form, setForm] = useState({
    ...selected,
    contrato: selected.contratoId.cliente,
    productos: selected.descripcionBienes || [],
  });
  console.log("Formulario inicial:", form);

  const contratos = useSelector((state) => state.almacen.allContratos);
  const contratoSede = contratos.filter(
    (contrato) => contrato.sedeId.nombre === "LURIN"
  );
  const contratoOptions = contratoSede.map((c) => c.cliente);
  useEffect(() => {
    if (contratos.length === 0) {
      dispatch(getAllContratosAlmacen());
    }
  }, [contratos.length]);
  const sendMessage = useSendMessage();
  const { error, validateForm } = useValidation(form);
  const [habilitar, setHabilitar] = useState(false);
  const actualizar = async () => {
    setHabilitar(true);
    try {
      console.log("Actualizar movimiento:", selected);
      const reponse = await axios.patch(
        `/almacen/movimientos/${selected._id}`,
        {
          ...form,
          contratoId: form.contrato._id,
        }
      );
      console.log("Respuesta de la actualización:", reponse);
      sendMessage("Movimiento actualizado con éxito", "Éxito");
      setShowEdit(false);
    } catch (error) {
      console.log("Error al actualizar movimiento:", error);
    } finally {
      setHabilitar(false);
    }
  };
  return (
    <Edit setShowEdit={setShowEdit} upDate={actualizar}>
      <PopUp deshabilitar={habilitar} />
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
      <CardPlegable title="Descripción de los Bienes Involucrados (Productos)">
        <Directorio
          ItemComponent={DescripcionDeBienes}
          data="productos"
          estilos=" flex justify-center items-center"
          directory={form.productos}
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
