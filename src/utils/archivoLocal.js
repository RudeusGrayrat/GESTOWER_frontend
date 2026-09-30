const apiUrl = import.meta.env.VITE_SERVER_URL || "";

export const obtenerUrlArchivo = (archivo) => {
  if (!archivo || archivo.startsWith("http") || archivo.startsWith("data:")) return archivo;
  return `${apiUrl.replace(/\/$/, "")}${archivo}`;
};
