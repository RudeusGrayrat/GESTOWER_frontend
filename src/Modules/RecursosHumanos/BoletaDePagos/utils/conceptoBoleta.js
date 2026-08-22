export const obtenerConceptoBoleta = (item, datosContables) => {
  if (item?.concepto) return item.concepto;

  const conceptoObj = datosContables.find(
    (dato) => dato.codigoPlame === item?.datosContables
  );

  return conceptoObj ? conceptoObj.concepto : "Concepto no encontrado";
};
