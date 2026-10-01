// src/utils/convertDocx.js
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import ImageModule from "docxtemplater-image-module-free";

const obtenerDimensionesImagen = (imageData) => {
  const bytes = new Uint8Array(imageData);

  if (bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return {
      width: (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19],
      height: (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23],
    };
  }

  if (bytes.length >= 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { width: bytes[6] | (bytes[7] << 8), height: bytes[8] | (bytes[9] << 8) };
  }

  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    const markers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (markers.has(marker)) {
        return {
          width: (bytes[offset + 7] << 8) | bytes[offset + 8],
          height: (bytes[offset + 5] << 8) | bytes[offset + 6],
        };
      }
      offset += 2 + length;
    }
  }

  return null;
};

const calcularTamanoProporcional = (imageData, maxWidth, maxHeight) => {
  const dimensions = obtenerDimensionesImagen(imageData);
  if (!dimensions?.width || !dimensions?.height) return [maxWidth, maxHeight];

  const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
  return [Math.round(dimensions.width * scale), Math.round(dimensions.height * scale)];
};

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

        // Las imágenes locales se publican desde la API, no desde el host del frontend.
        const apiUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
        const imageUrl = tagValue.startsWith("http")
          ? tagValue
          : `${apiUrl.replace(/\/$/, "")}/${tagValue.replace(/^\//, "")}`;
        const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
        return res.data;
      },
      getSize: (imageData, _tagValue, tagName) => {
        // Cada imagen ocupa su espacio máximo sin perder su proporción original.
        if (tagName === "logo_empresa") return calcularTamanoProporcional(imageData, 506, 238);
        if (tagName === "firma") return calcularTamanoProporcional(imageData, 106, 72);
        return [100, 100];
      },
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
