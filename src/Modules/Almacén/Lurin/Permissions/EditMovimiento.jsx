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
import { deepDiff } from "../../../validateEdit";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";

const EditMovimiento = ({ setShowEdit, selected }) => {
  const idSelected = selected._id;
  const { patchMovimientoAlmacen, user, patchProductosAlmacen, patchStockAlmacen } = useAuth()
  const [formInicial, setFormInicial] = useState({
    ...selected,
    contrato: selected.contratoId.cliente,
    productos: selected.descripcionBienes || [],
  });
  const [form, setForm] = useState({
    ...formInicial
  });

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

  const diferencias = deepDiff(formInicial, form);
  const actualizar = async () => {
    setHabilitar(true);
    if (diferencias.productos) {
      diferencias.descripcionBienes = diferencias.productos;
      delete diferencias.productos;
    }
    try {
      if (Object.keys(diferencias).length === 0) {
        sendMessage("No se realizaron cambios", "Info");
        return;
      }
      if (!idSelected) {
        sendMessage("ID de movimiento no válido", "Error");
        return;
      }
      if (!user || !user._id) {
        sendMessage("Usuario no autenticado", "Error");
        return;
      }
      await patchMovimientoAlmacen({
        actualizadoPor: user._id,
        _id: idSelected,
        ...diferencias,
      })
      //si se modificio la descripcion, subitem o la unidad de medida se debe actualizar el productoId
      if (diferencias.descripcionBienes) {
        for (const producto of diferencias.descripcionBienes) {
          //verfificar cambios en descripcion, subitem o unidad de medida
          const cambiosProducto = {};
          if (producto.descripcion) {
            cambiosProducto.descripcion = producto.descripcion;
          }
          if (producto.subItem) {
            cambiosProducto.subItem = producto.subItem;
          }
          if (producto.unidadDeMedida) {
            cambiosProducto.unidadDeMedida = producto.unidadDeMedida;
          }
          if (producto.cantidad) {
            cambiosProducto.cantidad = producto.cantidad;
          }
          if (Object.keys(cambiosProducto).length > 0 && producto.productoId) {
            await patchProductosAlmacen({
              _id: producto.productoId,
              ...cambiosProducto,
            });
            //opcional: actualizar stock del producto
            const stockProducto = await axios.get(`/getStockByParams`, {
              params: { productoId: producto.productoId },
            });
            const data = stockProducto.data.data[0]
            const newCambios = {
              _id: data._id,
              actualizadoPor: user._id,
              cantidadTotal: producto.cantidad
            }
            if (data) {
              await patchStockAlmacen(newCambios);
            }


          }

        }
      }

    } catch (error) {
      sendMessage(
        error || "Error al actualizar el movimiento",
        "Error"
      );
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
