import { useEffect, useState } from "react";
import Comun from "./Comun";

const DescuentosAlTrabajador = ({
  setForm,
  datosContables,
  initialData,
  set,
}) => {
  const [formDescuentosDelTrabajador, setFormDescuentosDelTrabajador] =
    useState({
      codigoPlame: initialData.datosContables || "",
      concepto: initialData.concepto || "",
      conceptoPersonalizado: Boolean(initialData.conceptoPersonalizado),
      tipo: "",
      monto: initialData.monto || "",
    });
  const findDescuentos = datosContables?.find(
    (a) => a.codigoPlame === formDescuentosDelTrabajador.codigoPlame
  );
  useEffect(() => {
    if (findDescuentos)
      setFormDescuentosDelTrabajador((prev) => ({
        ...prev,
        concepto: prev.conceptoPersonalizado
          ? prev.concepto
          : findDescuentos?.concepto,
        tipo: findDescuentos?.tipo,
      }));
  }, [findDescuentos, formDescuentosDelTrabajador.conceptoPersonalizado]);

  useEffect(() => {
    if (
      formDescuentosDelTrabajador.monto &&
      formDescuentosDelTrabajador.codigoPlame
    ) {
      set({
        datosContables: formDescuentosDelTrabajador.codigoPlame,
        concepto: formDescuentosDelTrabajador.concepto,
        conceptoPersonalizado:
          formDescuentosDelTrabajador.conceptoPersonalizado,
        monto: formDescuentosDelTrabajador.monto,
      });
    }
  }, [formDescuentosDelTrabajador]);

  return (
    <Comun
      form={formDescuentosDelTrabajador}
      setForm={setFormDescuentosDelTrabajador}
    />
  );
};

export default DescuentosAlTrabajador;
