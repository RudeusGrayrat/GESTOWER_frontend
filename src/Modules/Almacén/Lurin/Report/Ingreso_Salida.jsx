import { useEffect, useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import Input from "../../../../recicle/Inputs/Inputs";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const Ingreso_Salida = ({ contratos, contratosId }) => {
    const [ingresoOptions, setIngresoOptions] = useState([]);
    const sendMessage = useSendMessage();
    const [form, setForm] = useState({
        contrato: "",
        correlativa: "",
    });
    const [disable, setDisable] = useState(true);
    useEffect(() => {
        const isValid =
            form.contrato &&
            form.correlativa
        setDisable(!isValid);
    }, [form.contrato, form.correlativa]);

    const enviar = async () => {
        sendMessage("Generando reporte...", "Espere", true);
        try {
            const response = await axios.get(`/almacenLurin/getPDFMovimiento/${form.correlativa._id}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${form.correlativa?.correlativa}-${form.correlativa?.numeroDeActa}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Limpieza inmediata
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            if (!response.data) {
                sendMessage("No se pudo generar el reporte", "Error");
                return;
            }
            sendMessage("Reporte generado correctamente", "Correcto");
        } catch (error) {
            sendMessage("Error al generar el reporte", "Error");
        } finally {
            setForm({
                contrato: "",
                correlativa: "",
            });
        }
    }
    return (
        <ReportAlmacen
            form={form}
            setForm={setForm}
            descargar={enviar}
            title="Formato de Ingreso o Salida"
            options={contratosId}
            optionLabel="cliente"
            disable={disable}
        >
            <Input
                label="Código de Ingreso"
                name="correlativa"
                type="autocomplete"
                fetchData={"/getAllMovimientosBySede"}
                setOptions={setIngresoOptions}
                extraParams={{ contratoId: form.contrato?._id }}
                value={form.correlativa}
                setForm={setForm}
                placeholder="Escriba el código de ingreso para precargar datos"
                field="correlativa"
                options={ingresoOptions}
                disabled={!form.contrato}
            />
            <Input
                label="Número de Acta"
                name="numeroDeActa"
                value={form.correlativa?.numeroDeActa}
                disabled
            />
            <Input
                label="Movimiento"
                name="movimiento"
                value={form.correlativa?.movimiento}
                ancho="w-40 !min-w-32"
                disabled
            />
            {form.correlativa?.movimiento === "SALIDA" ? (
                <Input
                    label="Fecha de Salida"
                    name="fechaSalida"
                    type="date"
                    value={form.correlativa?.fechaSalida}
                    disabled
                />
            ) : (
                <Input
                    label="Fecha de Ingreso"
                    name="fechaIngreso"
                    type="date"
                    ancho="w-40 !min-w-32"
                    value={form.correlativa?.datosGenerales?.fecha}
                    disabled
                />
            )}
        </ReportAlmacen>
    );
};

export default Ingreso_Salida;
