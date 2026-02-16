import { useState } from "react";
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import RepresentanteLegal from "./RepresentanteLegal";
import ResponsableTecnico from "./ResponsableTecnico";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const RegisterTransportistas = () => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const [formData, setFormData] = useState({
        razonSocial: '',
        ruc: '',
        registroEors: '',
        autorizacionMunicipal: '',
        documentoRuta: '',
        direccion: '',
        ubigeoId: '',
        correoElectronico: '',
        telefono: '',
        representanteLegal: {
            nombre: '',
            dni: '',
        },
        responsableTecnico: {
            nombre: '',
            numeroColegiatura: '',
        }
    });
    const register = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando transportista...", "Cargando");

        try {
            // Validaciones básicas
            const camposObligatorios = [
                { campo: formData.razonSocial, nombre: "Razón Social" },
                { campo: formData.ruc, nombre: "RUC" },
                { campo: formData.registroEors, nombre: "Registro EO-RS" },
                { campo: formData.direccion, nombre: "Dirección" },
                { campo: formData.ubigeoId, nombre: "Ubigeo" },
                { campo: formData.correoElectronico, nombre: "Correo electrónico" },
                { campo: formData.telefono, nombre: "Teléfono" }
            ];

            const camposFaltantes = camposObligatorios
                .filter(item => !item.campo)
                .map(item => item.nombre);

            if (camposFaltantes.length > 0) {
                sendMessage(`Campos obligatorios: ${camposFaltantes.join(', ')}`, "Advertencia");
                return;
            }

            // Validar representante legal
            if (!formData.representanteLegal.nombre || !formData.representanteLegal.dni) {
                sendMessage("Complete los datos del representante legal", "Advertencia");
                return;
            }

            // Validar RUC (11 dígitos)
            if (!/^\d{11}$/.test(String(formData.ruc))) {
                sendMessage("El RUC debe tener 11 dígitos numéricos", "Advertencia");
                return;
            }

            const response = await axios.post("/certificaciones/postTransportista", formData);
            const data = response.data;

            sendMessage(data.message, data.type || "Correcto");

            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al registrar transportista", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };
    const resetForm = () => {
        setFormData({
            razonSocial: '',
            ruc: '',
            registroEors: '',
            autorizacionMunicipal: '',
            documentoRuta: '',
            direccion: '',
            ubigeoId: '',
            correoElectronico: '',
            telefono: '',
            representanteLegal: {
                nombre: '',
                dni: '',
            },
            responsableTecnico: {
                nombre: '',
                numeroColegiatura: '',
            }
        });
    }
    console.log("Form Data:", formData);
    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Datos Básicos del Transportista">
                <DatosBasicos formData={formData} setFormData={setFormData} />
            </CardPlegable>

            <CardPlegable title="Representante Legal">
                <RepresentanteLegal formData={formData} setFormData={setFormData} />
            </CardPlegable>

            <CardPlegable title="Responsable Técnico">
                <ResponsableTecnico formData={formData} setFormData={setFormData} />
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
        </div >
    )

}

export default RegisterTransportistas