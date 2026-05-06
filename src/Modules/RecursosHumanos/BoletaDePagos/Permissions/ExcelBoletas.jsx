import * as XLSX from "xlsx";
import axios from "../../../../api/axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useSendMessage from "../../../../recicle/senMessage";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import { getEmployees } from "../../../../redux/modules/Recursos Humanos/actions";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import PopUp from "../../../../recicle/popUps";

const ExcelBoletas = () => {
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();
  const [file, setFile] = useState(null);
  console.log("Archivo seleccionado:", file);
  const [deshabilitar, setDeshabilitar] = useState(false);
  const colaboradores = useSelector(
    (state) => state.recursosHumanos.allEmployees
  );
  console.log("Colaboradores en estado:", colaboradores);

  useEffect(() => {
    if (colaboradores.length === 0) dispatch(getEmployees());
  }, [colaboradores, dispatch]);

  const handleUpload = async () => {
    sendMessage("Enviando boletas...", "Cargando", true);
    if (!file || !file.archivo) {
      sendMessage("Debe seleccionar un archivo", "Error");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Hojas
        const sheetBoletas = XLSX.utils.sheet_to_json(
          workbook.Sheets["BOLETA DE PAGO"]
        );
        const sheetRem = XLSX.utils.sheet_to_json(
          workbook.Sheets["REMUNERACIONES"]
        );
        const sheetDesc = XLSX.utils.sheet_to_json(
          workbook.Sheets["DESCUENTOS AL TRABJADOR"]
        );
        const sheetApo = XLSX.utils.sheet_to_json(
          workbook.Sheets["APORTACIONES DEL EMPLEADOR"]
        );

        // 🔹 Función para agrupar por documento
        const agrupar = (rows, keyCodigo = "Codigo Plame") => {
          const map = {};
          rows.forEach((row) => {
            const doc = row["N° documento"]?.toString();
            if (!map[doc]) map[doc] = [];
            map[doc].push({
              datosContables: row[keyCodigo]?.toString(),
              monto: (() => {
                const raw = row["Monto"];
                if (raw === undefined || raw === null || raw === "") return 0;
                const parsed = Number(
                  String(raw).replace(/\s+/g, "").replace(",", ".")
                );
                if (Number.isNaN(parsed)) return 0;
                return Number(parsed.toFixed(2));
              })()?.toString(),
            });
          });
          return map;
        };

        const remuneracionesMap = agrupar(sheetRem);
        const descuentosMap = agrupar(sheetDesc);
        const aportacionesMap = agrupar(sheetApo);

        // 🔹 Construcción de objetos finales
        const mappedData = sheetBoletas
          .map((row) => {
            const documento = row["N° documento"].toString();
            const colaborador = colaboradores.find(
              (c) => c.documentNumber === documento
            );

            if (!colaborador) return null;
            console.log("Colaborador encontrado:", colaborador);

            return {
              colaborador: colaborador,
              diasTrabajados: row["Dias Trabajados"]?.toString(),
              fechaBoletaDePago: row["Fecha de la Boleta"]?.toString(),
              diasSubsidiados: "0",
              horasTrabajadas: "192",
              diasNoLaborales: "0",
              remuneraciones: remuneracionesMap[documento] || [],
              descuentosAlTrabajador: descuentosMap[documento] || [],
              aportacionesDelEmpleador: aportacionesMap[documento] || [],
            };
          })
          .filter(Boolean);

        console.log("✅ Payload final:", mappedData);

        const errores = [];
        for (let boleta of mappedData) {
          try {
            await axios.post("/postBoletaDePagos", boleta);
            console.log("Boleta registrada:", boleta.colaborador);
          } catch (error) {
            errores.push({
              colaborador: boleta.colaborador,
              error:
                error?.response?.data?.message ||
                error.message ||
                "Error desconocido",
            });
            console.error("❌ Error al registrar boleta:", boleta, error);
          }
        }
        if (errores.length > 0) {
          sendMessage(
            `Hubo errores al registrar ${errores.length} boletas. Revisar consola para detalles.`,
            "Error"
          );
          console.table(errores);
        } else {
          sendMessage(
            "Todas las boletas se registraron correctamente.",
            "Correcto"
          );
          setFile(null);
        }
      };

      reader.readAsArrayBuffer(file.archivo);
    } catch (error) {
      console.error("Error al procesar Excel:", error);
      sendMessage("Error al procesar archivo", "Error");
    }
  };
  return (
    <div>
      <PopUp deshabilitar={deshabilitar} />
      <CardPlegable title="Subir Boletas desde Excel">
        <div className="flex items-center border rounded-lg px-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile({ archivo: e.target.files[0] })}
          />
          <ButtonOk
            disabled={!file || !file.archivo || file === null}
            onClick={handleUpload}
            type="ok"
            children="Subir Archivo"
          />
        </div>
      </CardPlegable>
    </div>
  );
};

export default ExcelBoletas;
