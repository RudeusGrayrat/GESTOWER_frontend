import { useEffect, useState } from "react";
import Comun from "./Comun";

const AportacionesDelEmpleador = ({
  setForm,
  datosContables,
  initialData,
  form,
  set,
}) => {
  const [formAportacionesDelEmpleador, setFormAportacionesDelEmpleador] =
    useState({
      codigoPlame: initialData.datosContables || "",
      concepto: initialData.concepto || "",
      conceptoPersonalizado: Boolean(initialData.conceptoPersonalizado),
      tipo: "",
      monto: initialData.monto || "",
    });
  const findAportacion = datosContables.find(
    (dato) => dato.codigoPlame === formAportacionesDelEmpleador.codigoPlame
  );


  useEffect(() => {
    if (findAportacion)
      setFormAportacionesDelEmpleador((prev) => ({
        ...prev,
        concepto: prev.conceptoPersonalizado
          ? prev.concepto
          : findAportacion?.concepto,
        tipo: findAportacion?.tipo,
      }));
  }, [findAportacion, formAportacionesDelEmpleador.conceptoPersonalizado]);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      aportacionesDelEmpleador: [
        ...prevForm.aportacionesDelEmpleador.map((descuento) =>
          descuento.datosContables === formAportacionesDelEmpleador.codigoPlame
            ? {
                datosContables: formAportacionesDelEmpleador.codigoPlame,
                concepto: formAportacionesDelEmpleador.concepto,
                conceptoPersonalizado:
                  formAportacionesDelEmpleador.conceptoPersonalizado,
                monto: formAportacionesDelEmpleador.monto,
              }
            : descuento
        ),
      ],
    }));
  }, [formAportacionesDelEmpleador]);
  useEffect(() => {
    if (
      formAportacionesDelEmpleador.monto &&
      formAportacionesDelEmpleador.codigoPlame
    ) {
      set({
        datosContables: formAportacionesDelEmpleador.codigoPlame,
        concepto: formAportacionesDelEmpleador.concepto,
        conceptoPersonalizado:
          formAportacionesDelEmpleador.conceptoPersonalizado,
        monto: formAportacionesDelEmpleador.monto,
      });
    }
  }, [formAportacionesDelEmpleador]);

  return (
    <Comun
      form={formAportacionesDelEmpleador}
      setForm={setFormAportacionesDelEmpleador}
    />
  );
};

export default AportacionesDelEmpleador;
