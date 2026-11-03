import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import useSendMessage from "../../../recicle/senMessage";

const AccesoManifestower = ({ tipo, empresa, onChanged }) => {
  const sendMessage = useSendMessage();
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);
  useEffect(() => { let activo = true; axios.get(`/manifesTower/accesos/${tipo}/${empresa._id}`).then(({ data }) => activo && setEstado(data.data)).catch(() => activo && setEstado({ acceso: "SIN_CUENTA", estadoComercial: empresa.estado })); return () => { activo = false; }; }, [tipo, empresa._id, empresa.estado]);
  const ejecutar = async (accion) => {
    const textos = { ACTIVAR: "¿Activar acceso a ManifesTower?", DESACTIVAR: "¿Desactivar solo el acceso a ManifesTower? La empresa seguirá operativa en Gestower.", RESTABLECER_RUC: "¿Restablecer la contraseña al RUC? Comunícala únicamente por un canal seguro." };
    if (!window.confirm(textos[accion])) return;
    setCargando(true);
    try { const { data } = await axios.patch(`/manifesTower/accesos/${tipo}/${empresa._id}`, { accion }); sendMessage(data.message, "Correcto"); const actual = await axios.get(`/manifesTower/accesos/${tipo}/${empresa._id}`); setEstado(actual.data.data); onChanged?.(); }
    catch (error) { sendMessage(error.response?.data?.message || "No se pudo actualizar el acceso.", "Error"); }
    finally { setCargando(false); }
  };
  const accesoActivo = estado?.acceso === "ACTIVO";
  return <section className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
    <div><h3 className="font-semibold text-blue-950">Acceso a ManifesTower</h3><p className="text-sm text-blue-900">Estado comercial: <strong>{estado?.estadoComercial || "…"}</strong> · Acceso: <strong>{estado?.acceso || "…"}</strong></p></div>
    <p className="text-xs text-blue-800">Desactivar este acceso no suspende a la empresa ni impide que Tower cree manifiestos internamente.</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={cargando || accesoActivo || estado?.estadoComercial !== "ACTIVO"} onClick={() => ejecutar("ACTIVAR")} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white disabled:opacity-50">Activar acceso</button>
      <button type="button" disabled={cargando || !accesoActivo} onClick={() => ejecutar("DESACTIVAR")} className="rounded-lg bg-amber-600 px-3 py-2 text-sm text-white disabled:opacity-50">Desactivar acceso</button>
      <button type="button" disabled={cargando || !accesoActivo} onClick={() => ejecutar("RESTABLECER_RUC")} className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white disabled:opacity-50">Restablecer al RUC</button>
    </div>
  </section>;
};
export default AccesoManifestower;
