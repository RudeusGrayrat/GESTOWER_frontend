// src/utils/limpiarPlantilla.js
import PizZip from "pizzip";
import axios from "axios";

export const limpiarPlantilla = async (plantillaUrl) => {
    console.log("🧹 Iniciando limpieza de plantilla:", plantillaUrl);

    try {
        // 1. Descargar la plantilla
        const response = await axios.get(plantillaUrl, {
            responseType: "arraybuffer",
        });

        // 2. Cargar el archivo ZIP
        const zip = new PizZip(response.data);

        // 3. Extraer el XML del documento
        let xmlContent = zip.file("word/document.xml").asText();
        console.log("📄 XML original (primeros 500 chars):", xmlContent.substring(0, 500));

        // 4. ANÁLISIS DETALLADO: Buscar TODOS los patrones de variables
        console.log("🔍 Analizando estructura de variables...");

        // Encontrar todas las ocurrencias de {{ y }}
        const openBrackets = [...xmlContent.matchAll(/{{/g)];
        const closeBrackets = [...xmlContent.matchAll(/}}/g)];

        console.log(`📊 Total {{ encontrados: ${openBrackets.length}`);
        console.log(`📊 Total }} encontrados: ${closeBrackets.length}`);

        // 5. Extraer el texto entre cada par de {{ y }}
        const variablesEncontradas = new Set();

        for (let i = 0; i < openBrackets.length; i++) {
            const startPos = openBrackets[i].index;
            // Encontrar el }} correspondiente
            const closePos = closeBrackets.find(c => c.index > startPos)?.index;

            if (closePos) {
                // Extraer el texto entre {{ y }}
                const betweenBraces = xmlContent.substring(startPos + 2, closePos);

                // Limpiar el texto de todas las etiquetas XML
                const cleanText = betweenBraces
                    .replace(/<[^>]*>/g, ' ') // Reemplazar etiquetas con espacio
                    .replace(/\s+/g, ' ')      // Normalizar espacios
                    .trim();

                console.log(`📝 Entre {{ y }}: "${cleanText}" (longitud: ${cleanText.length})`);

                // Si el texto limpio no está vacío, es una posible variable
                if (cleanText && cleanText.length > 0 && !cleanText.includes('<')) {
                    // Dividir por espacios y tomar la primera palabra (asumiendo que es el nombre)
                    const words = cleanText.split(' ');
                    const possibleVar = words.find(w => w.length > 0 && !w.includes('>'));

                    if (possibleVar) {
                        variablesEncontradas.add(possibleVar);
                        console.log(`✅ Variable candidata: "${possibleVar}"`);
                    }
                }
            }
        }

        console.log(`📋 Total variables candidatas encontradas: ${variablesEncontradas.size}`);
        console.log("Variables:", Array.from(variablesEncontradas));

        if (variablesEncontradas.size === 0) {
            // Último intento: buscar cualquier texto que parezca una variable
            const allText = xmlContent.replace(/<[^>]*>/g, ' ');
            const possibleVars = allText.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
            const commonVars = ['numero_manifiesto', 'año', 'mes', 'razon_social', 'ruc'];

            const foundVars = possibleVars.filter(v =>
                v.length > 3 &&
                (commonVars.some(cv => v.includes(cv)) || v.includes('_'))
            );

            foundVars.forEach(v => variablesEncontradas.add(v));
            console.log("🔍 Variables encontradas por patrón de texto:", Array.from(variablesEncontradas));
        }

        if (variablesEncontradas.size === 0) {
            throw new Error("No se pudo extraer ninguna variable. La plantilla puede estar corrupta.");
        }

        // 6. Ahora que tenemos los nombres, buscar los patrones exactos en el XML
        let cleanedXml = xmlContent;

        Array.from(variablesEncontradas).forEach(variable => {
            // Buscar patrones donde la variable aparece cerca de {{ y }}
            const regex = new RegExp(`{{[^}]*${escapeRegExp(variable)}[^}]*}}`, 'g');
            cleanedXml = cleanedXml.replace(regex, `{{${variable}}}`);
        });

        // 7. Eliminar etiquetas problemáticas
        cleanedXml = cleanedXml.replace(/<w:proofErr[^>]*\/>/g, '');

        // 8. Verificar resultado
        const variablesFinales = (cleanedXml.match(/{{[^}]+}}/g) || []).length;
        console.log(`✨ Variables finales en XML: ${variablesFinales}`);

        if (variablesFinales === 0) {
            throw new Error("La limpieza no produjo variables válidas.");
        }

        // 9. Actualizar el XML
        zip.file("word/document.xml", cleanedXml);

        // 10. Generar el nuevo archivo
        const plantillaLimpiaBuffer = zip.generate({ type: "arraybuffer" });
        const plantillaLimpiaBlob = new Blob([plantillaLimpiaBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const plantillaLimpiaUrl = URL.createObjectURL(plantillaLimpiaBlob);

        console.log(`✅ Plantilla limpiada exitosamente con ${variablesFinales} variables`);
        return plantillaLimpiaUrl;

    } catch (error) {
        console.error("❌ Error limpiando plantilla:", error);
        throw error;
    }
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}