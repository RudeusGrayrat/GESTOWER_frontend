import { useState } from "react";

const useValidation = () => {
  const [error, setError] = useState({
    nombre: false,
    tipo: false,
    tipoContrato: false,
    archivo: false,
    state: false,
  });

  // Función de validación
  const validateForm = (formData) => {
    const newError = {
      nombre: formData.nombre === "",
      tipo: formData.tipo === "",
      tipoContrato: formData.tipo === "CONTRATO" && formData.tipoContrato === "",
      archivo: !formData.archivo,
      state: formData.state === "",
    };

    setError(newError);

    // Verifica si el formulario es válido
    return Object.values(newError).every((field) => field === false);

    // return formIsValid;
  };

  return { error, validateForm };
};

export default useValidation;
