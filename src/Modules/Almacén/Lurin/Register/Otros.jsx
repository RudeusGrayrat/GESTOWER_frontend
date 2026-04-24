import InputFiles from "../../../../recicle/Inputs/tipos/InputFile";
import InputNormal from "../../../../recicle/Inputs/tipos/Normal";

const Otros = ({ form, setForm, error }) => {
  return (
    <div className="w-full flex flex-wrap ">
      <div className="w-full flex flex-wrap p-2">
        <InputFiles
          label="Referencia Fotografica"
          name="referenciaImagen"
          value={form.referenciaImagen}
          setForm={setForm}
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
        <div className=" flex flex-col  w-[49%] ">
          <label className={`text-base font-medium  "text-gray-700" `}>
            Observaciones
          </label>
          <textarea
            label="Observaciones"
            className="mt-1 py-2 border px-3 w-[100%] !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            name="observaciones"
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          />
        </div>
        <div className=" flex flex-col w-[49%] ">
          <label className={`text-base font-medium  "text-gray-700" `}>
            Detalles de Peso
          </label>
          <textarea
            label="Detalles de Peso"
            className="mt-1 py-2 border px-3 w-[100%] !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            name="detallesDePeso"
            value={form.detallesDePeso}
            onChange={(e) => setForm({ ...form, detallesDePeso: e.target.value })}
          />
        </div>
      </div>

    </div>
  );
};

export default Otros;
