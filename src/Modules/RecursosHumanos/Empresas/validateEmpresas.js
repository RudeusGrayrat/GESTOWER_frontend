import { useState } from "react";

const useValidation = () => {
  const [error, setError] = useState({
    ruc: false,
    razonSocial: false,
    domicilioFiscal: false,
    // logo: false,
    representative: {
      name: false,
      documentType: false,
      documentNumber: false,
      // signature: false,
    },
  });

  // Función de validación
  const validateForm = (formData) => {
    const newError = {
      ruc: formData.ruc === "",
      razonSocial: formData.razonSocial === "",
      domicilioFiscal: formData.domicilioFiscal === "",
      representative: {
        name: formData.representative.name === "",
        documentType: formData.representative.documentType === "",
        documentNumber: formData.representative.documentNumber === "",
      },
    };

    setError(newError);

    const formIsValid = Object.values(newError).every(
      (field) =>
        field === false ||
        (typeof field === "object" &&
          Object.values(field).every((subfield) => subfield === false))
    );

    return formIsValid;
  };

  return { error, validateForm };
};

export default useValidation;
