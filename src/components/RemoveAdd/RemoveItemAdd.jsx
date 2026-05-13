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
const Directorio = ({ ItemComponent, setForm, directory, estilos, error, data,
  addToTop = false, ...props
}) => {

  const [formData, setFormData] = useState(
    directory?.map((dir, index) => ({
      id: index + 1,
      initialData: dir,
    })) || [] // <-- ¡Cambiado a []!
  );
  const handleAddForm = () => {
    const newItem = {
      id: Date.now(),
      initialData: {},
    };

    setFormData(
      addToTop
        ? [newItem, ...formData]
        : [...formData, newItem]
    );
  };

  const handleRemoveForm = (id) => {
    setFormData(formData.filter((form) => form.id !== id));
  };

  const handleUpdateFormData = (id, newData) => {
    const updatedForms = formData?.map((form) =>
      form.id === id
        ? { ...form, initialData: { ...form.initialData, ...newData } }
        : form
    );
    setFormData(updatedForms);
    setForm((prevEdition) => ({
      ...prevEdition,
      [data]: updatedForms?.map((form) => form.initialData),
    }));
  };
  useEffect(() => {
    const newData =
      directory?.map((dir, index) => ({
        id: index + 1,
        initialData: dir,
      })) || [];

    setFormData((prev) => {
      // Comparación segura para evitar re-renderizados y bucles
      const prevSerialized = JSON.stringify(prev);
      const newSerialized = JSON.stringify(newData);
      if (prevSerialized === newSerialized) return prev;
      return newData;
    });
  }, [directory]);
  useEffect(() => {
    // Mapeamos los datos para obtener solo los 'initialData'
    const rawData = formData?.map((form) => form.initialData);

    // ⭐️ FILTRAMOS LOS OBJETOS VACÍOS {} ⭐️
    const filteredData = rawData.filter((item) => !isContentEmpty(item));

    setForm((prevEdition) => ({
      ...prevEdition,
      [data]: filteredData, // <--- Enviamos los datos filtrados
    }));
  }, [formData, setForm, data]); // Asegúrate de incluir 'data' en las dependencias si no lo estaba
  return (
    <div className="w-full mt-0 flex flex-col gap-4">
      {addToTop && (
        <div className="w-full">
          <ButtonOk
            type="ok"
            children="+"
            classe="w-full !from-gray-300 !to-gray-400"
            styles="mt-2 px-20 mb-0 "
            onClick={handleAddForm}
          />
        </div>
      )}
      {formData?.map((form) => (
        <div
          key={form.id}
          className={` ${estilos} border py-4 bg-white  border-slate-200 shadow-lg rounded-xl`}
        >
          <ItemComponent
            initialData={form.initialData}
            set={(newData) => handleUpdateFormData(form.id, newData)}
            error={error}
            {...props}
          />
          <ButtonOk
            classe="w-full"
            styles="!my-0 px-3  mx-2"
            onClick={() => handleRemoveForm(form.id)}
            children="X"
          />
        </div>
      ))}
      {!addToTop && <div className="w-full">
        <ButtonOk
          type="ok"
          children="+"
          classe="w-full !from-gray-300 !to-gray-400"
          styles="mt-2 px-20 mb-0 "
          onClick={handleAddForm}
        />
      </div>}
    </div>
  );
};

export default Directorio;
