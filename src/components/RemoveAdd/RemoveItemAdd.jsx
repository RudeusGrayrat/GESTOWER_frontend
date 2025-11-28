import { useEffect, useState } from "react";
import ButtonOk from "../../recicle/Buttons/Buttons";
const isContentEmpty = (obj) => {
  // Si no es un objeto, es null, o es un Array, no lo filtramos.
  if (typeof obj !== "object" || obj === null || Array.isArray(obj))
    return false;

  // Aquí puedes hacer la verificación estricta de objeto literal vacío:
  if (Object.keys(obj).length === 0) return true;

  // Si tienes objetos anidados con sólo campos vacíos,
  // puedes usar una verificación más profunda, pero para tu caso {} es suficiente.
  return false;
};
const Directorio = (props) => {
  const { ItemComponent, setForm, directory, estilos, error, data } = props;
  const [formData, setFormData] = useState(
    directory?.map((dir, index) => ({
      id: index + 1,
      initialData: dir,
    })) || [] // <-- ¡Cambiado a []!
  );
  const handleAddForm = () => {
    setFormData([...formData, { id: Date.now(), initialData: {} }]);
  };

  const handleRemoveForm = (id) => {
    setFormData(formData.filter((form) => form.id !== id));
  };

  const handleUpdateFormData = (id, newData) => {
    const updatedForms = formData.map((form) =>
      form.id === id
        ? { ...form, initialData: { ...form.initialData, ...newData } }
        : form
    );
    setFormData(updatedForms);
    setForm((prevEdition) => ({
      ...prevEdition,
      [data]: updatedForms.map((form) => form.initialData),
    }));
  };

  useEffect(() => {
    // Mapeamos los datos para obtener solo los 'initialData'
    const rawData = formData.map((form) => form.initialData);

    // ⭐️ FILTRAMOS LOS OBJETOS VACÍOS {} ⭐️
    const filteredData = rawData.filter((item) => !isContentEmpty(item));

    setForm((prevEdition) => ({
      ...prevEdition,
      [data]: filteredData, // <--- Enviamos los datos filtrados
    }));
  }, [formData, setForm, data]); // Asegúrate de incluir 'data' en las dependencias si no lo estaba
  return (
    <div className="w-full">
      {formData.map((form) => (
        <div
          key={form.id}
          className={` ${estilos} border mt-2 border-slate-300 rounded`}
        >
          <ItemComponent
            initialData={form.initialData}
            set={(newData) => handleUpdateFormData(form.id, newData)}
            error={error}
            {...props}
          />
          <ButtonOk
            classe="w-full"
            styles="my-7 px-6  mx-4"
            onClick={() => handleRemoveForm(form.id)}
            children="X"
          />
        </div>
      ))}
      <ButtonOk
        type="ok"
        children="+"
        classe="w-[95%]"
        styles="mt-8 !ml-10 px-8 mb-3 "
        onClick={handleAddForm}
      />
    </div>
  );
};

export default Directorio;
