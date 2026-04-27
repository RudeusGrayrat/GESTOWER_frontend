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
  const sendMessage = useSendMessage();
  const { user } = useAuth();

  const formOriginal = {
    estado: ubicacionSeleccionada?.estado,
    porcentaje: ubicacionSeleccionada?.porcentaje || 0,
    bienes: ubicacionSeleccionada?.bienes?.map((b) => ({
      bienId: b.bienId?._id || b.bienId,
      movimientoId: b.movimientoId?._id || b.movimientoId,
      cantidad: b.cantidad,
      descripcion: b.descripcion,
    })) || [],
  };

  const [edit, setEdit] = useState({ ...formOriginal });

  // Cálculos de información valiosa
  const totalItems = edit.bienes.length;
  const cantidadTotal = edit.bienes.reduce((acc, curr) => acc + Number(curr.cantidad), 0);

  const editUbicacion = async () => {
    const cambios = deepDiff(formOriginal, edit);
    if (Object.keys(cambios).length === 0) {
      return sendMessage("No se detectaron cambios.", "Info");
    }

    sendMessage("Sincronizando...", "Info", true);
    try {
      await axios.patch(`/ubicacion/update-complete/${ubicacionSeleccionada._id}`, {
        ...edit,
        actualizadoPor: user._id
      });
      sendMessage("Inventario actualizado", "Correcto");
      reload();
      setViewUbicacion(false);
    } catch (error) {
      sendMessage(error?.response?.data?.message || "Error", "Error");
    }
  };

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
            </div>

            <div className="pt-2">
              <span className={`px-4 py-1 rounded-full text-xs font-bold ${edit.estado === 'LIBRE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                ESTADO: {edit.estado}
              </span>
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

      <div className="p-4 bg-white border-t flex justify-end gap-4">
        <ButtonOk onClick={() => setViewUbicacion(false)}>Cancelar</ButtonOk>
        <ButtonOk onClick={editUbicacion} type="ok">Confirmar y Guardar</ButtonOk>
      </div>
    </div>
  );
};

export default ViewUbicacion;