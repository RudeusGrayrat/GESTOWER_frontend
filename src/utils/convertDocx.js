// src/utils/convertDocx.js
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

const convertDocx = async (predata, archivo, nameDoc) => {
  // Detectar entorno de desarrollo
  const isDev = process.env.NODE_ENV === 'development';

  try {
    if (!archivo) {
      throw new Error("Archivo de plantilla no disponible");
    }

    // Añadir missingKey por defecto (como en la versión original)
    const data = {
      ...predata,
      missingKey: "N/A",
    };

    const response = await axios.get(archivo, {
      responseType: "arraybuffer",
    });

    let content = response.data;

    if (!content || !(content instanceof ArrayBuffer)) {
      throw new Error("El archivo descargado está vacío o no es válido");
    }

    content = new Uint8Array(content);

    const zip = new PizZip(content);
    if (!zip.file("word/document.xml")) {
      throw new Error("El archivo no parece ser una plantilla válida de Word.");
    }

    // Solo en desarrollo: logs y verificaciones adicionales
    if (isDev) {
      const xmlContent = zip.file("word/document.xml").asText();
      const variablesEnPlantilla = xmlContent.match(/{{[^}]+}}/g) || [];
      console.log(`🔍 Variables encontradas en plantilla: ${variablesEnPlantilla?.length}`);

      if (variablesEnPlantilla.length === 0) {
        console.warn("⚠️ La plantilla no contiene variables. Verifica el formato.");
      } else {
        console.log("Primeras 10 variables:", variablesEnPlantilla.slice(0, 10));

        const dataKeys = Object.keys(data);
        const variablesFaltantes = variablesEnPlantilla
          .map(v => v.replace(/{{|}}/g, ''))
          .filter(v => !dataKeys.includes(v));

        if (variablesFaltantes.length > 0) {
          console.warn(`⚠️ ${variablesFaltantes.length} variables en plantilla no están en datos:`,
            variablesFaltantes.slice(0, 10));
        }
      }
    }

    // Configurar docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{{", end: "}}" },
    });

    // Renderizar documento
    doc.render(data);

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    if (!blob) {
      throw new Error("No se pudo generar el archivo .docx");
    }

    const file = new File([blob], `${nameDoc}.docx`, {
      type: blob.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return file;

  } catch (error) {
    // Log del error siempre (para depuración)
    console.error("❌ Error en convertDocx:", error.message);
    if (error.properties && error.properties.errors) {
      console.error("Errores de docxtemplater:", error.properties.errors);
    }
    // Lanzar el error con el mensaje original (como en la versión simple)
    throw new Error(error.message || "Error al generar el documento");
  }
};

export default convertDocx;