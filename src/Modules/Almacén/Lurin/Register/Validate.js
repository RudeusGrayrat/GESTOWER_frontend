import { useState, useRef } from "react";

const useValidation = () => {
  const [error, setError] = useState({});
  const [firstInvalidPath, setFirstInvalidPath] = useState(null);
  const firstInvalidPathRef = useRef(null);

  const isEmpty = (value) =>
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);

  // Modificamos validateForm para que reciba el tipo de movimiento ("INGRESO" o "SALIDA")
  const validateForm = (formData, tipoMovimiento = "INGRESO") => {
    firstInvalidPathRef.current = null;

    // 📝 DEFINICIÓN DINÁMICA DE CAMPOS OPCIONALES
    // Campos que SIEMPRE son opcionales en ambos casos
    const opcionalesSiempre = [
      "observaciones",
      "pesoNeto",
      "pesoBruto",
      "estadoEnvase",
      "subItem"
    ];

    // Si es INGRESO, hay campos que no se usan o no se validan igual
    const opcionalesIngreso = [
      ...opcionalesSiempre,
      "horaSalida",
      "fechaSalida",
      "detallesDePeso",
      "codigoIngreso"
    ];

    // Si es SALIDA, casi todo lo que vino del ingreso ya está lleno, 
    // pero configuramos la lista según tus necesidades de negocio
    const opcionalesSalida = [
      ...opcionalesSiempre,
      "estadoActa"
    ];

    // Elegimos la lista correcta según el contexto actual
    const camposOpcionales = tipoMovimiento === "INGRESO" ? opcionalesIngreso : opcionalesSalida;

    // Función interna recursiva que ahora conoce los campos opcionales configurados
    const validateRecursive = (data, path = "") => {
      // 1. Validar Arrays
      if (Array.isArray(data)) {
        if (data.length === 0) {
          if (!firstInvalidPathRef.current) firstInvalidPathRef.current = path;
          return true;
        }

        const arrayErrors = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const itemError = validateRecursive(item, `${path}[${i}]`);
          arrayErrors.push(itemError);

          if (!firstInvalidPathRef.current && containsError(itemError)) {
            firstInvalidPathRef.current = `${path}[${i}]`;
          }
        }
        return arrayErrors;
      }

      // 2. Validar Objetos
      if (typeof data === "object" && data !== null) {
        const objError = {};
        for (const key in data) {
          const value = data[key];
          const currentPath = path ? `${path}.${key}` : key;

          // 🚀 Saltamos la validación si el campo es opcional para este movimiento
          if (camposOpcionales.includes(key)) {
            objError[key] = false;
            continue;
          }

          if (typeof value === "object") {
            objError[key] = validateRecursive(value, currentPath);
          } else {
            const invalid = isEmpty(value);
            objError[key] = invalid;
            if (invalid && !firstInvalidPathRef.current) {
              firstInvalidPathRef.current = currentPath;
            }
          }
        }
        return objError;
      }

      // 3. Primitivos
      const invalid = isEmpty(data);
      if (invalid && !firstInvalidPathRef.current) {
        firstInvalidPathRef.current = path;
      }
      return invalid;
    };

    const validationResult = validateRecursive(formData);
    setError(validationResult);
    setFirstInvalidPath(firstInvalidPathRef.current);

    const isValid = !containsError(validationResult);

    return {
      isValid,
      errors: validationResult,
      firstInvalidPath: firstInvalidPathRef.current,
    };
  };

  const containsError = (obj) => {
    if (typeof obj === "boolean") return obj;
    if (Array.isArray(obj)) return obj.some((item) => containsError(item));
    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some((item) => containsError(item));
    }
    return false;
  };

  return { error, validateForm, firstInvalidPath };
};

export default useValidation;