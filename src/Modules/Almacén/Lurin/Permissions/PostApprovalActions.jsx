import { useState } from "react";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";
import useSendMessage from "../../../../recicle/senMessage";

const PostApprovalActions = ({ movimiento }) => {
  const { user } = useAuth();
  const sendMessage = useSendMessage();
  const permissions = user?.modules?.find((module) => module.submodule?.name === "LURIN")?.submodule?.permissions || [];
  const canObserve = permissions.includes("OBSERVAR");
  const canCorrectWeight = permissions.includes("CORREGIR_PESO");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const [weight, setWeight] = useState({ bienId: "", pesoNeto: "", pesoBruto: "", justificacion: "" });

  if (!canObserve && !canCorrectWeight) return null;
  const submitComment = async () => {
    try {
      await axios.post("/postComentarioMovimiento", { movimientoId: movimiento._id, texto: comment, creadoPor: user._id });
      setComment(""); sendMessage("Comentario registrado", "Bien");
    } catch (error) { sendMessage(error.response?.data?.message || error.message, "Error"); }
  };
  const uploadActas = async () => {
    try {
      const body = new FormData(); files.forEach((file) => body.append("actas", file)); body.append("subidoPor", user._id);
      await axios.post(`/movimientos/${movimiento._id}/actas`, body, { headers: { "Content-Type": "multipart/form-data" } });
      setFiles([]); sendMessage("Acta(s) adjuntada(s)", "Bien");
    } catch (error) { sendMessage(error.response?.data?.message || error.message, "Error"); }
  };
  const correctWeight = async () => {
    try {
      await axios.patch("/corregirPesoMovimiento", { movimientoId: movimiento._id, ...weight, corregidoPor: user._id });
      setWeight({ bienId: "", pesoNeto: "", pesoBruto: "", justificacion: "" }); sendMessage("Peso corregido con auditoría", "Bien");
    } catch (error) { sendMessage(error.response?.data?.message || error.message, "Error"); }
  };

  return <div className="mt-6 border-t pt-4 space-y-4">
    <h3 className="text-xl font-bold">Seguimiento posterior a la aprobación</h3>
    {canObserve && <>
      <textarea className="w-full border rounded p-2" placeholder="Agregar comentario u observación" value={comment} onChange={(event) => setComment(event.target.value)} />
      <button type="button" className="text-sky-700 font-medium" disabled={!comment.trim()} onClick={submitComment}>Registrar comentario</button>
      <input type="file" multiple accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFiles(Array.from(event.target.files || []))} />
      <button type="button" className="text-sky-700 font-medium ml-3" disabled={!files.length} onClick={uploadActas}>Adjuntar acta escaneada</button>
    </>}
    {canCorrectWeight && movimiento.estado === "APROBADO" && <div className="bg-amber-50 p-3 rounded space-y-2">
      <p className="font-medium">Corrección de peso (requiere justificación y deja historial)</p>
      <select className="border rounded p-2 w-full" value={weight.bienId} onChange={(event) => setWeight({ ...weight, bienId: event.target.value })}><option value="">Seleccione un ítem</option>{movimiento.descripcionBienes?.map((bien) => <option key={bien._id} value={bien._id}>#{bien.item} — {bien.descripcion}</option>)}</select>
      <div className="flex gap-2"><input className="border rounded p-2 w-1/2" type="number" min="0" step="any" placeholder="Peso neto" value={weight.pesoNeto} onChange={(event) => setWeight({ ...weight, pesoNeto: event.target.value })} /><input className="border rounded p-2 w-1/2" type="number" min="0" step="any" placeholder="Peso bruto" value={weight.pesoBruto} onChange={(event) => setWeight({ ...weight, pesoBruto: event.target.value })} /></div>
      <textarea className="w-full border rounded p-2" placeholder="Justificación obligatoria" value={weight.justificacion} onChange={(event) => setWeight({ ...weight, justificacion: event.target.value })} />
      <button type="button" className="text-amber-700 font-medium" disabled={!weight.bienId || !weight.justificacion.trim()} onClick={correctWeight}>Corregir peso</button>
    </div>}
  </div>;
};

export default PostApprovalActions;
