const ActasEscaneadas = ({ value = [], onChange, existing = [] }) => (
  <div className="w-full p-2">
    <label className="text-base font-medium text-gray-700">Acta escaneada (PDF, JPG o PNG)</label>
    <input
      type="file"
      multiple
      accept="application/pdf,image/jpeg,image/png"
      className="block mt-2"
      onChange={(event) => onChange([...value, ...Array.from(event.target.files || [])])}
    />
    <p className="text-xs text-gray-500 mt-1">Máximo 10 archivos de 15 MB cada uno.</p>
    <ul className="mt-2 list-disc pl-5 text-sm">
      {existing.map((acta) => <li key={acta._id || acta.url}><a className="text-sky-700 underline" href={acta.url} target="_blank" rel="noreferrer">{acta.nombre}</a></li>)}
      {value.map((file, index) => <li key={`${file.name}-${index}`}>{file.name} <button type="button" className="text-red-500 ml-2" onClick={() => onChange(value.filter((_, fileIndex) => fileIndex !== index))}>Quitar</button></li>)}
    </ul>
  </div>
);

export default ActasEscaneadas;
