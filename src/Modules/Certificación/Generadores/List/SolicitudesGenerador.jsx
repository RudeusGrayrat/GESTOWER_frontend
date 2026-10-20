import { useEffect, useState } from "react";
import axios from "../../../../api/axios";

const SolicitudesGenerador = ({ permissionApprove }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [seleccionada, setSeleccionada] = useState(null);
    const [detalleVerificacion, setDetalleVerificacion] = useState("");
    const [codigoVerificacion, setCodigoVerificacion] = useState("");
    const [confirmada, setConfirmada] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
    const cargar = async () => {
        try { const { data } = await axios.get("/manifesTower/solicitudes-generador", { headers: headers() }); setSolicitudes(data.data || []); }
        catch (error) { setError(error.response?.data?.message || "No se pudieron cargar las solicitudes."); }
    };
    useEffect(() => { cargar(); }, []);
    const aprobar = async () => {
        if (!confirmada || !detalleVerificacion.trim() || !/^[0-9a-f]{16}$/i.test(codigoVerificacion.trim())) return;
        setLoading(true); setError(""); setMensaje("");
        try {
            const { data } = await axios.post(`/manifesTower/solicitudes-generador/${seleccionada._id}/aprobar`, { verificacionConfirmada: true, detalleVerificacion, codigoVerificacion }, { headers: headers() });
            setMensaje(data.message); setSeleccionada(null); setConfirmada(false); setDetalleVerificacion(""); setCodigoVerificacion(""); await cargar();
        } catch (error) { setError(error.response?.data?.message || "No se pudo aprobar la solicitud."); }
        finally { setLoading(false); }
    };
    return <section className="mx-5 mb-5 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <h2 className="font-bold text-lg">Solicitudes provisionales de generadores ({solicitudes.length})</h2>
        <p className="text-sm text-gray-600">Verifica independientemente la representación de la empresa antes de aprobar. El enlace por sí solo no acredita identidad.</p>
        {mensaje && <p className="text-green-700 text-sm" role="status">{mensaje}</p>}
        {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
        {!solicitudes.length && <p className="text-sm text-gray-500 mt-2">No hay solicitudes pendientes.</p>}
        <div className="flex flex-wrap gap-3 mt-3">{solicitudes.map((solicitud) => <button key={solicitud._id} type="button" onClick={() => { setSeleccionada(solicitud); setDetalleVerificacion(""); setCodigoVerificacion(""); setConfirmada(false); }} className="text-left rounded-lg border border-slate-300 p-3 hover:bg-slate-50">
            <strong>{solicitud.razonSocial}</strong><br /><span className="text-sm">RUC {solicitud.ruc} · {solicitud.estado === "PENDIENTE_DATOS" ? "Esperando datos" : "Pendiente de verificación"}</span>
        </button>)}</div>
        {seleccionada && <div className="mt-4 space-y-3 border-t pt-4 text-sm">
            <h3 className="font-bold">{seleccionada.razonSocial} — {seleccionada.ruc}</h3>
            <p>Transportista solicitante: {seleccionada.transportistaId?.razonSocial} ({seleccionada.transportistaId?.ruc})</p>
            <p>Contacto propuesto: {seleccionada.correoElectronico} · {seleccionada.telefono}</p>
            {seleccionada.estado === "PENDIENTE_DATOS" ? <p>El generador aún no ha completado el enlace.</p> : <>
                <p>Representante: {seleccionada.datosCompletados?.representanteLegal} · DNI/CE {seleccionada.datosCompletados?.dniRepresentante}</p>
                {(seleccionada.datosCompletados?.plantas || []).map((planta, i) => <p key={i}>Planta: {planta.denominacion} · {planta.direccion} · Ubigeo ID: {planta.ubigeoId}</p>)}
                {(seleccionada.datosCompletados?.responsablesTecnicos || []).map((responsable, i) => <div key={i}><p>Responsable: {responsable.nombreResponsable} · {responsable.dniResponsable} · {responsable.cargoResponsable}</p>{responsable.firmaResponsable && <img src={responsable.firmaResponsable} alt="Imagen de firma propuesta" className="max-h-20 max-w-48" />}</div>)}
                <p>La solicitud incluye la aceptación de la vinculación; no autoriza firma ni envío automáticos.</p>
                {permissionApprove ? <>
                    <label className="block">Describe el canal y la verificación realizada<textarea maxLength={500} value={detalleVerificacion} onChange={(e) => setDetalleVerificacion(e.target.value)} className="block w-full rounded border p-2 mt-1" /></label>
                    <label className="block">Código comunicado por el generador mediante el canal verificado<input value={codigoVerificacion} maxLength={16} onChange={(e) => setCodigoVerificacion(e.target.value.toUpperCase())} autoComplete="off" className="block rounded border p-2 mt-1" /></label>
                    <label className="flex gap-2"><input type="checkbox" checked={confirmada} onChange={(e) => setConfirmada(e.target.checked)} />He verificado independientemente que quien completó la solicitud está autorizado por la empresa.</label>
                    <button type="button" onClick={aprobar} disabled={loading || !confirmada || !detalleVerificacion.trim() || !/^[0-9a-f]{16}$/i.test(codigoVerificacion.trim())} className="rounded bg-green-700 text-white px-4 py-2 disabled:opacity-50">{loading ? "Aprobando…" : "Aprobar y activar"}</button>
                </> : <p>Se requiere el permiso APROBAR de GENERADORES para activar la solicitud.</p>}
            </>}
        </div>}
    </section>;
};
export default SolicitudesGenerador;
