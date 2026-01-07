import { useEffect, useState } from "react";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import PDetail from "../../../../recicle/PDtail";
import ProgressCircle from "../../../../recicle/Otros/ProgressCircle";
import ProductosUbicacion from "./Productos";
import { useAuth } from "../../../../context/AuthContext";
import PopUp from "../../../../recicle/popUps";

const ViewUbicacion = ({ ubicacionSeleccionada, setViewUbicacion }) => {
  const sendMessage = useSendMessage();
  const [deshabilitar, setDeshabilitar] = useState(false);
  const form = {
    estado: ubicacionSeleccionada?.estado,
    porcentaje: ubicacionSeleccionada?.porcentaje || 0,
    productos:
      ubicacionSeleccionada?.productos?.map((prod) => ({
        subItem: prod.productoId.subItem,
        productoId: prod.productoId._id,
        cantidad: prod.cantidad,
        descripcion: prod.productoId.descripcion,
        unidadDeMedida: prod.productoId.unidadDeMedida,
      })) || [],
  };
  const { patchUbicacionProducto, user } = useAuth();
  const [edit, setEdit] = useState({ ...form });
  const normalizarProductos = (productos = []) => {
    const productosNormalizados = productos.map(p => ({
      productoId: p.productoId?._id || p.productoId,
      cantidad: Number(p.cantidad || 0),
      descripcion: p.descripcion || p.productoId?.descripcion,
    }));
    return productosNormalizados;
  }

  const editUbicacion = async () => {
    setDeshabilitar(true);
    sendMessage("Guardando cambios...", "Info");
    const inicial = normalizarProductos(form.productos);
    const actual = normalizarProductos(edit.productos);

    try {
      const mapInicial = {};
      for (const p of inicial) {
        mapInicial[p.productoId] = p.cantidad;
      }

      const mapActual = {};
      for (const p of actual) {
        mapActual[p.productoId] = p.cantidad;
      }

      const ajustes = [];

      const ids = new Set([
        ...Object.keys(mapInicial),
        ...Object.keys(mapActual),
      ]);
      for (const productoId of ids) {
        const antes = mapInicial[productoId] || 0;
        const ahora = mapActual[productoId] || 0;
        const diferenciaCantidad = ahora - antes;

        if (diferenciaCantidad !== 0) {
          ajustes.push({ productoId, diferenciaCantidad });
        }
      }
      for (const ajuste of ajustes) {
        if (ajuste.diferenciaCantidad > 0) {
          const res = await axios.get("/getStockByParams", {
            params: {
              productoId: ajuste.productoId,
            },
          });
          const data = res.data;

          const disponible = Number(data.data[0].cantidadDisponible);
          if (!disponible) {
            return sendMessage(
              `No hay stock disponible para el producto ID: ${ajuste.productoId}`,
              "Error"
            );
          }
          if (disponible < ajuste.diferenciaCantidad) {
            setDeshabilitar(false);
            return sendMessage(
              `Stock insuficiente. Disponible: ${disponible}, requerido: ${ajuste.diferenciaCantidad}`,
              "Error"
            );
          }
        }
      }
      for (const ajuste of ajustes) {
        await axios.patch("/patchStockAlmacen", {
          productoId: ajuste.productoId,
          diferenciaCantidad: -ajuste.diferenciaCantidad, // ojo al signo
        });
      }

      await patchUbicacionProducto({
        _id: ubicacionSeleccionada._id,
        actualizadoPor: user._id,
        estado: edit.estado,
        porcentaje: edit.porcentaje,
        productos: actual.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
      });
    } catch (error) {
      sendMessage(error?.response?.data?.message, "Error");
    } finally {
      setDeshabilitar(false);
    }
  };

  useEffect(() => {
    if (edit.porcentaje >= 100) {
      setEdit((prev) => ({ ...prev, estado: "OCUPADO" }));
    } else if (edit.porcentaje > 0 && edit.porcentaje < 100) {
      setEdit((prev) => ({ ...prev, estado: "PARCIALMENTE OCUPADO" }));
    } else if (edit.porcentaje === 0 && edit.estado === "LIBRE") {
      return;
    } else {
      setEdit((prev) => ({ ...prev, estado: "LIBRE" }));
    }
  }, [edit.porcentaje]);
  return (
    <div className="w-[90%] h-[89%] bg-white flex flex-col justify-between border-gray-100 border shadow-2xl fixed top-[5vh] z-50 rounded-xl">
      <div className="  flex justify-center items-start min-h-[85%]  max-h-[90%]">
        <div className="px-6 pt-4 overflow-y-auto mt-6 h-[97%] max-h-[97%] w-[95%] flex flex-col bg-gradient-to-tr from-slate-100 to-white rounded-lg shadow-lg ">
          <div className="  my-2 md:min-h-[60%] 2xl:min-h-[45%] flex justify-evenly w-full">
            <PopUp deshabilitar={deshabilitar} />
            <div className=" flex flex-col justify-start content-center center w-[40%]">
              <p className="text-3xl mb-5 font-bold">Detalles de Ubicación</p>
              <div className="flex flex-wrap gap-x-6  ">
                <PDetail
                  content="ZONA: "
                  value={ubicacionSeleccionada?.zonaId.nombre}
                />
                <PDetail content="RACK: " value={ubicacionSeleccionada?.rack} />
                <PDetail
                  content="NIVEL: "
                  value={ubicacionSeleccionada?.nivel}
                />
                <PDetail
                  content="SECCIÓN: "
                  value={ubicacionSeleccionada?.seccion}
                />
                <PDetail
                  content="PRODUCTOS: "
                  value={ubicacionSeleccionada?.seccion}
                />
                <PDetail
                  content="SECCIÓN: "
                  value={ubicacionSeleccionada?.seccion}
                />
              </div>
            </div>
            <div className="sm:max-w-[40%] md:max-w-[50%] lg:max-w-[30%] xl:max-w-[20%] flex flex-wrap justify-center ">
              <p className="text-3xl mb-5 font-bold">Espacio Ocupado</p>
              <ProgressCircle
                percentage={edit.porcentaje}
                onEditChange={(value) =>
                  setEdit((prev) => ({ ...prev, porcentaje: value }))
                }
              />
            </div>
          </div>
          <div className="">
            <CardPlegable title="Productos en esta Ubicación">
              <Directorio
                ItemComponent={ProductosUbicacion}
                data="productos"
                estilos=" flex justify-center items-center"
                error={{
                  cantidad: false,
                  descripcion: false,
                  unidadDeMedida: false,
                  subItem: false,
                }}
                setForm={setEdit}
                directory={edit.productos}
              />
            </CardPlegable>
          </div>
        </div>
      </div>
      <div className="min-h-[10%] max-h-[12%] flex justify-end items-center m-2 ">
        <ButtonOk
          onClick={() => editUbicacion()}
          children="Guardar"
          type="ok"
        />
        <ButtonOk onClick={() => setViewUbicacion(false)} children="Cerrar" />
      </div>
    </div>
  );
};

export default ViewUbicacion;
