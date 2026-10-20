const emptyRow = (kind) => kind === "peso"
  ? { concepto: "", pesoNeto: "", pesoBruto: "", observacion: "" }
  : { asunto: "", descripcion: "" };

const DetalleCompuesto = ({ label, kind, value, onChange }) => {
  const current = value || { texto: "", filas: [] };
  const update = (next) => onChange({ texto: next.texto || "", filas: next.filas || [] });
  const updateRow = (index, field, fieldValue) => {
    const filas = current.filas.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: fieldValue } : row);
    update({ ...current, filas });
  };

  return (
    <div className="w-full border rounded-lg p-3 bg-slate-50">
      <label className="text-base font-medium text-gray-700">{label}</label>
      <textarea
        className="mt-1 py-2 border px-3 w-full text-base rounded-md shadow-sm"
        placeholder="Texto libre (opcional)"
        value={current.texto}
        onChange={(event) => update({ ...current, texto: event.target.value })}
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-slate-200 text-left">
              {kind === "peso" ? <><th className="p-2">Concepto</th><th className="p-2">Peso neto (kg)</th><th className="p-2">Peso bruto (kg)</th><th className="p-2">Observación</th></> : <><th className="p-2">Asunto</th><th className="p-2">Descripción</th></>}
              <th className="p-2 w-12" />
            </tr>
          </thead>
          <tbody>
            {current.filas.map((row, index) => (
              <tr key={index} className="border-t">
                {kind === "peso" ? <>
                  <td className="p-1"><input className="w-full border rounded p-1" value={row.concepto} onChange={(e) => updateRow(index, "concepto", e.target.value)} /></td>
                  <td className="p-1"><input type="number" min="0" step="any" className="w-full border rounded p-1" value={row.pesoNeto} onChange={(e) => updateRow(index, "pesoNeto", e.target.value)} /></td>
                  <td className="p-1"><input type="number" min="0" step="any" className="w-full border rounded p-1" value={row.pesoBruto} onChange={(e) => updateRow(index, "pesoBruto", e.target.value)} /></td>
                  <td className="p-1"><input className="w-full border rounded p-1" value={row.observacion} onChange={(e) => updateRow(index, "observacion", e.target.value)} /></td>
                </> : <>
                  <td className="p-1"><input className="w-full border rounded p-1" value={row.asunto} onChange={(e) => updateRow(index, "asunto", e.target.value)} /></td>
                  <td className="p-1"><input className="w-full border rounded p-1" value={row.descripcion} onChange={(e) => updateRow(index, "descripcion", e.target.value)} /></td>
                </>}
                <td className="p-1 text-center"><button type="button" aria-label="Eliminar fila" className="pi pi-trash text-red-500" onClick={() => update({ ...current, filas: current.filas.filter((_, rowIndex) => rowIndex !== index) })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="mt-2 text-sky-700 font-medium" onClick={() => update({ ...current, filas: [...current.filas, emptyRow(kind)] })}>+ Agregar fila</button>
    </div>
  );
};

export default DetalleCompuesto;
