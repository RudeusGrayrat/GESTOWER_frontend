import { useEffect, useState } from "react";
import Comun from "./Comun";

const Remuneraciones = ({
  form,
  setForm,
  set,
  datosContables,
  initialData,
}) => {
  const [formRemuneraciones, setFormRemuneraciones] = useState({
    codigoPlame: initialData.datosContables || "",
    concepto: initialData.concepto || "",
    conceptoPersonalizado: Boolean(initialData.conceptoPersonalizado),
    tipo: "",
    monto: initialData.monto || "0",
  });

  const findRemuneracion = datosContables.find(
    (dato) => dato.codigoPlame === formRemuneraciones.codigoPlame
  );

  useEffect(() => {
    if (findRemuneracion) {
      setFormRemuneraciones((prevData) => ({
        ...prevData,
        concepto: prevData.conceptoPersonalizado
          ? prevData.concepto
          : findRemuneracion?.concepto,
        tipo: findRemuneracion?.tipo,
      }));
    }
  }, [findRemuneracion, formRemuneraciones.conceptoPersonalizado]);

  useEffect(() => {
    if (formRemuneraciones.monto && formRemuneraciones.codigoPlame) {
      set({
        datosContables: formRemuneraciones.codigoPlame,
        concepto: formRemuneraciones.concepto,
        conceptoPersonalizado: formRemuneraciones.conceptoPersonalizado,
        monto: formRemuneraciones.monto,
      });
    }
  }, [formRemuneraciones]);

  return <Comun form={formRemuneraciones} setForm={setFormRemuneraciones} />;
};

export default Remuneraciones;
