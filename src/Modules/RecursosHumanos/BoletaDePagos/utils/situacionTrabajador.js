export const obtenerSituacionTrabajador = (situacion) => {
  if (situacion === "INACTIVO") return "BAJA";
  return situacion || "";
};
