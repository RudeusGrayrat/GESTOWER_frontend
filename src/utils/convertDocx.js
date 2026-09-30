// src/utils/convertDocx.js
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import ImageModule from "docxtemplater-image-module-free";

const convertDocx = async (predata, archivo, nameDoc) => {
  // Detectar entorno de desarrollo

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
    })
    if (!response)
      throw new Error("No se pudo descargar la plantilla del documento");
    let content = response.data;

    if (!content || !(content instanceof ArrayBuffer)) {
      throw new Error("El archivo descargado está vacío o no es válido");
    }

    content = new Uint8Array(content);

    const zip = new PizZip(content);
    if (!zip.file("word/document.xml")) {
      throw new Error("El archivo no parece ser una plantilla válida de Word.");
    }

    const imageOptions = {
      centered: false,
      getImage: async (tagValue) => {
        if (!tagValue) {
          throw new Error("La plantilla recibió una imagen sin valor");
        }

        if (tagValue.startsWith("data:image")) {
          const base64 = tagValue.split(",")[1];
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
          }
          return bytes.buffer;
        }

        // Las imágenes antiguas pueden ser URL externas y las nuevas son locales/base64.
        const baseUrl = window.location.origin;
        const imageUrl = tagValue.startsWith('http') ? tagValue : `${baseUrl}/${tagValue.replace(/^\//, '')}`;
        const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
        return res.data;
      },
      getSize: () => [140, 70],
    };

    const imageModule = new ImageModule(imageOptions);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{{", end: "}}" },
      modules: [imageModule], // <-- Añadir aquí
    });

    await doc.renderAsync(data);

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    if (!blob) {
      throw new Error("No se pudo generar el archivo .docx");
    }

    return new File([blob], `${nameDoc}.docx`, { type: blob.type });

  } catch (error) {;
    if (error.properties && error.properties.errors) {
      console.error("Errores de docxtemplater:", error.properties.errors);
    }
    // Lanzar el error con el mensaje original (como en la versión simple)
    throw new Error(error || "Error al generar el documento");
  }
};

export default convertDocx;
