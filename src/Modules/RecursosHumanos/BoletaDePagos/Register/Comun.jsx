import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../recicle/Inputs/Inputs";
import { useEffect } from "react";
import { getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";

const Comun = ({ form, setForm, habilitar }) => {
  const datosContables = useSelector((state) => state.recursosHumanos.datosContables);

  const dispatch = useDispatch();
  useEffect(() => {
    if (datosContables.length === 0) dispatch(getDatosContables());
  }, [datosContables.length, dispatch]);
  const codigosPlame = datosContables.map((a) => a.codigoPlame);

  return (
    <div className="flex flex-wrap">
      <Input
        label="Código Plame"
        name="codigoPlame"
        type="select"
        options={codigosPlame}
        value={form.codigoPlame || ""}
        setForm={setForm}
      />
      <Input
        label="Concepto"
        ancho="w-[500px]"
        name="concepto"
        value={form.concepto}
        setForm={setForm}
        disabled={!form.conceptoPersonalizado}
      />
      <div className="flex items-end h-20 mx-3 pb-3">
        <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
          <input
            type="checkbox"
            checked={Boolean(form.conceptoPersonalizado)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                conceptoPersonalizado: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Editar concepto
        </label>
      </div>
      <Input
        label="Tipo"
        ancho="w-[500px]"
        name="tipo"
        value={form.tipo || ""}
        setForm={setForm}
      />

      <Input
        label="Monto"
        onKeyPress={(e) => {
          if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        name="monto"
        value={form.monto}
        setForm={setForm}
      />
    </div>
  );
};

export default Comun;
