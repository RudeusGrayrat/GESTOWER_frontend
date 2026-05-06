import { useEffect, useState } from "react";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import PDetail from "../../../../recicle/PDtail";
import ProgressCircle from "../../../../recicle/Otros/ProgressCircle";
import ProductosUbicacion from "./Productos";
import { useAuth } from "../../../../context/AuthContext";
import { deepDiff } from "../../../validateEdit";

const ViewUbicacion = ({ ubicacionSeleccionada, setViewUbicacion, reload }) => {
  console.log("ubicacionSeleccionada en ViewUbicacion", ubicacionSeleccionada);
  const sendMessage = useSendMessage();
  const { user } = useAuth();

  // ... dentro de ViewUbicacion ...
  const formOriginal = {
    porcentaje: ubicacionSeleccionada?.porcentaje || 0,
    bienes: ubicacionSeleccionada?.bienes?.map((b) => ({
      // Extraemos los datos del populate que viene en ubicacionSeleccionada.bienes
      stockId: b.stockId?._id || b.stockId,
      cantidadIngresada: b.cantidadIngresada,
      descripcion: b.descripcion,
      // Estos campos son cruciales para que el input del hijo no salga vacío
      correlativa: b.stockId?.movimientoId?.correlativa || "",
    })) || [],
  };
  console.log("formOriginal", formOriginal);
  const [edit, setEdit] = useState({ ...formOriginal });

  const totalItems = edit.bienes.length;
  const cantidadTotal = edit.bienes.reduce((acc, curr) => acc + Number(curr.cantidadIngresada || 0), 0);

  const editNormalizado = {
    ...edit,
    bienes: edit.bienes.map((b) => ({
      stockId: b.stockId?._id || b.stockId,
      cantidadIngresada: Number(b.cantidadIngresada),
      descripcion: b.descripcion,
      correlativa: b.correlativa || b.stockId?.movimientoId?.correlativa || "",
    }))
  };
  console.log("editNormalizado", editNormalizado);

  const cambios = deepDiff(formOriginal, editNormalizado);
  console.log("cambios detectados antes de enviar al backend", cambios);

  const editUbicacion = async () => {
    // 1. VALIDACIÓN DE DUPLICADOS
    const stockIds = edit.bienes.map(b => (b.stockId?._id || b.stockId)?.toString());
    const tieneDuplicados = stockIds.some((id, index) => stockIds.indexOf(id) !== index);

    if (tieneDuplicados) {
      return sendMessage("No puedes asignar el mismo producto varias veces a la misma ubicación.", "Error");
    }

    // 2. VALIDACIÓN DE CANTIDADES VACÍAS
    const tieneVacios = edit.bienes.some(b => !b.cantidadIngresada || Number(b.cantidadIngresada) <= 0);
    if (tieneVacios) {
      return sendMessage("Todos los productos deben tener una cantidad válida.", "Error");
    }

    // 3. NORMALIZACIÓN PARA EL BACKEND
    if (Object.keys(cambios).length === 0) {
      return sendMessage("No se detectaron cambios.", "Info");
    }

    // Limpieza estricta para el Backend
    const bienesParaEnviar = edit.bienes.map(({ stockId, cantidadIngresada, descripcion }) => ({
      stockId,
      cantidadIngresada: Number(cantidadIngresada),
      descripcion
    }));

    sendMessage("Sincronizando...", "Info", true);
    try {
      // Lógica de estado simplificada (el backend también la tiene, pero la enviamos para asegurar)
      let nuevoEstado = "PARCIALMENTE OCUPADO";
      if (edit.porcentaje === 0 && bienesParaEnviar.length === 0) nuevoEstado = "LIBRE";
      if (edit.porcentaje === 100) nuevoEstado = "OCUPADO";

      const response = await axios.patch("/patchUbicacionProducto", {
        _id: ubicacionSeleccionada._id,
        bienes: bienesParaEnviar,
        porcentaje: edit.porcentaje,
        estado: nuevoEstado,
        actualizadoPor: user._id
      });

      if (response.status < 400) {
        sendMessage(response.data.message, "Correcto");
        reload();
        setViewUbicacion(false);
      }
    } catch (error) {
      sendMessage(error?.response?.data?.message || "Error al actualizar", "Error");
    }
  };

  let color = "text-gray-900";
  if (ubicacionSeleccionada?.estado === "LIBRE") {
    color = "text-green-700";
  } else if (ubicacionSeleccionada?.estado === "PARCIALMENTE OCUPADO") {
    color = "text-orange-700";
  } else if (ubicacionSeleccionada?.estado === "OCUPADO") {
    color = "text-red-600";
  }


  return (
    <div className="w-[90%] h-[89%] bg-white flex flex-col justify-between border shadow-2xl fixed top-[5vh] z-50 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {/* CABECERA CON DATOS VALIOSOS */}
        <div className="bg-white shadow-sm rounded-xl p-6 border flex flex-wrap justify-around items-center mb-6">
          <div className="space-y-3">
            <div>
              <h2 className="text-sky-800 text-2xl font-bold">Ubicación: {ubicacionSeleccionada?.rack}</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <PDetail content="ZONA:" value={ubicacionSeleccionada?.zonaId.nombre} />
              <PDetail content="NIVEL:" value={ubicacionSeleccionada?.nivel} />
              <PDetail content="SECCIÓN:" value={ubicacionSeleccionada?.seccion} />
              <PDetail content="PRODUCTOS DISTINTOS:" value={totalItems} />
              <PDetail content="STOCK TOTAL AQUÍ:" value={cantidadTotal} />
              <PDetail content="ESTADO:" tamaño={color + " font-semibold"} value={ubicacionSeleccionada?.estado} />

            </div>
          </div>

          {/* CÍRCULO CON INPUT DIGITALIZABLE */}
          <div className="flex flex-col items-center p-4 rounded-3xl">
            <p className="text-[16px] font-black text-sky-600 mb-2 uppercase tracking-widest">Ocupado</p>
            <ProgressCircle
              size={160}
              percentage={edit.porcentaje}
              onEditChange={(val) => setEdit(prev => ({ ...prev, porcentaje: val }))}
            >
            </ProgressCircle>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Bienes Asignados</h3>
          <Directorio
            ItemComponent={ProductosUbicacion}
            estilos=" flex justify-center items-center"
            data="bienes"
            setForm={setEdit}
            directory={edit.bienes}
          />
        </div>
      </div>

      <div className="px-10 p-3 bg-white border-t flex justify-end gap-10">
        <ButtonOk classe={" !px-10 "} styles={" my-4 px-0"} onClick={() => setViewUbicacion(false)}>Cancelar</ButtonOk>
        <ButtonOk classe={" !px-10 "} styles={" my-4 px-0"}  onClick={editUbicacion} type="ok">Confirmar y Guardar</ButtonOk>
      </div>
    </div>
  );
};

export default ViewUbicacion;