import InputFiles from "../../../../recicle/Inputs/tipos/InputFile";
import InputNormal from "../../../../recicle/Inputs/tipos/Normal";
import DetalleCompuesto from "./DetalleCompuesto";
import ActasEscaneadas from "./ActasEscaneadas";

const Otros = ({ form, setForm, error }) => {
  return (
    <div className="w-full flex flex-wrap ">
      <div className="w-full flex flex-wrap p-2">
        <InputFiles
          label="Referencia Fotografica"
          name="referenciaImagen"
          value={form.referenciaImagen}
          setForm={setForm}
          multiple
        />
        <InputNormal
          label="Hora de Salida"
          name="horaSalida"
          type="time"
          value={form.horaSalida}
          setForm={setForm}
        />
        <InputNormal
          label="Fecha de Salida"
          name="fechaSalida"
          type="date"
          value={form.fechaSalida}
          setForm={setForm}
        />
      </div>
      <div className="w-full flex flex-wrap justify-center p-2 gap-4">
        <DetalleCompuesto label="Detalles de peso" kind="peso" value={form.detallePeso || { texto: form.detallesDePeso || "", filas: [] }} onChange={(detallePeso) => setForm({ ...form, detallePeso, detallesDePeso: detallePeso.texto })} />
        <DetalleCompuesto label="Observaciones" kind="observacion" value={form.detalleObservaciones || { texto: form.observaciones || "", filas: [] }} onChange={(detalleObservaciones) => setForm({ ...form, detalleObservaciones, observaciones: detalleObservaciones.texto })} />
        <ActasEscaneadas value={form.actasPendientes || []} existing={form.actasEscaneadas || []} onChange={(actasPendientes) => setForm({ ...form, actasPendientes })} />
      </div>

    </div>
  );
};

export default Otros;
