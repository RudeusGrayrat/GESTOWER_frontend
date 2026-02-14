import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios";
import DatosPlanta from "./DatosPlanta";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import Responsable from "./Responsable";
import IgaInfo from "./IgaInfo"; // Nuevo componente

const RegisterPlanta = () => {
    const sendMessage = useSendMessage();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [form, setForm] = useState({
        generadorId: "",
        denominacion: "",
        tipoPlanta: "",
        direccion: "",
        ubigeoId: "",
        coordenadasUtm: { norte: "", este: "", zona: "" },
        actividadEconomica: "",
        sector: "",
        responsableGestion: {
            nombre: "",
            cargo: "",
            dni: "",
            correo: "",
            telefono: ""
        },
        tieneIga: false,
        igaAprobadoPor: "", // Cambié de institucionApruebaIga a igaAprobadoPor
        fechaAprobacionIga: "",
        numeroResolucionIga: "",
        estado: "ACTIVO"
    });

    const register = async () => {
        setDeshabilitar(true);
        setMessage("Registrando planta...", "Cargando");

        try {
            // Validaciones mejoradas
            const camposObligatorios = [
                { campo: form.generadorId, nombre: "Generador" },
                { campo: form.denominacion, nombre: "Denominación" },
                { campo: form.tipoPlanta, nombre: "Tipo de planta" },
                { campo: form.direccion, nombre: "Dirección" },
                { campo: form.ubigeoId, nombre: "Ubigeo" }
            ];

            const camposFaltantes = camposObligatorios
                .filter(item => !item.campo)
                .map(item => item.nombre);

            if (camposFaltantes.length > 0) {
                sendMessage(`Campos obligatorios: ${camposFaltantes.join(', ')}`, "Advertencia");
                return;
            }

            // Validar responsable
            const responsable = form.responsableGestion;
            if (!responsable.nombre || !responsable.cargo || !responsable.dni || !responsable.correo) {
                sendMessage("Complete todos los datos del responsable.", "Advertencia");
                return;
            }

            // Validar IGA si tiene
            if (form.tieneIga) {
                if (!form.igaAprobadoPor || !form.fechaAprobacionIga || !form.numeroResolucionIga) {
                    sendMessage("Complete todos los datos del IGA.", "Advertencia");
                    return;
                }
            }

            console.log("Enviando datos:", form); // Debug

            const response = await axios.post("/certificaciones/postPlanta", form);
            const data = response.data;
            sendMessage(data.message, data.type || "Correcto");

            // Reset form si fue exitoso
            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al registrar planta", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    const resetForm = () => {
        setForm({
            generadorId: "",
            denominacion: "",
            tipoPlanta: "",
            direccion: "",
            ubigeoId: "",
            coordenadasUtm: { norte: "", este: "", zona: "" },
            actividadEconomica: "",
            sector: "",
            responsableGestion: {
                nombre: "",
                cargo: "",
                dni: "",
                correo: "",
                telefono: ""
            },
            tieneIga: false,
            igaAprobadoPor: "",
            fechaAprobacionIga: "",
            numeroResolucionIga: "",
            estado: "ACTIVO"
        });
    };
    console.log("Renderizando RegisterPlanta con form:", form); // Debug render

    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />

            <CardPlegable title="Datos de la Planta">
                <DatosPlanta form={form} setForm={setForm} />
            </CardPlegable>

            <CardPlegable title="Datos del Responsable de Gestión">
                <Responsable form={form} setForm={setForm} />
            </CardPlegable>

            <CardPlegable title="Información de IGA (Instrumento de Gestión Ambiental)">
                <IgaInfo form={form} setForm={setForm} />
            </CardPlegable>

            <div className="flex justify-center mt-6">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-32 mr-4"
                    onClick={() => resetForm()}
                    disabled={deshabilitar}
                />
                <ButtonOk
                    type="ok"
                    onClick={register}
                    classe="!w-32"
                    children="Registrar"
                    disabled={deshabilitar}
                />
            </div>
        </div>
    );
};

export default RegisterPlanta;