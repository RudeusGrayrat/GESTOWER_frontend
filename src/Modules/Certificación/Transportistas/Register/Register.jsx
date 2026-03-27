import { useEffect, useState } from "react";
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import Contingencias from "./Contingencias";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import GeneradoresTransportistas from "./Generadores";
import Responsable_y_Representante from "./Responsable_Y_Representante";
import Conductores from "./Conductores";

const RegisterTransportistas = ({
    editData, setFormEdit
}) => {
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
        responsableTecnico: [
            {
                nombre: '',
                dni: '',
                cargo: '',
                numeroColegiatura: '',
            }
        ],
        contingencias: {
            derrame: '',
            infiltracion: '',
            incendio: '',
            explosion: '',
            otros: ''
        },
        generadores: [
            {
                _id: "",
                razonSocial: "",
            }
        ],
        conductores: [
            {
                nombre: "",
                licencia: "",
            }
        ]
    });
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
            },
            contingencias: {
                derrame: '',
                infiltracion: '',
                incendio: '',
                explosion: '',
                otros: ''
            },
            generadores: [
                {
                    _id: "",
                    razonSocial: "",
                }
            ],
            conductores: [
                {
                    nombre: "",
                    licencia: "",
                }
            ]
        });
    }
    const register = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando transportista...", "Cargando");

        try {
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
            const newData = {
                ...formData,
                generadores: formData.generadores.map(gen => gen._id) // Enviar solo los IDs de los generadores
            }
            const response = await axios.post("/certificaciones/postTransportista", newData);
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
    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Datos Básicos del Transportista">
                <DatosBasicos formData={editData ? editData : formData} setFormData={setFormEdit ? setFormEdit : setFormData} />
            </CardPlegable>
            <CardPlegable title="Contingencias">
                <Contingencias formData={editData ? editData : formData} setFormData={setFormEdit ? setFormEdit : setFormData} />
            </CardPlegable>
            <CardPlegable title="Responsable">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="responsableTecnico"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.responsableTecnico?.length > 0 ? editData.responsableTecnico : []) : (formData.responsableTecnico || [])}
                    ItemComponent={Responsable_y_Representante}
                />
            </CardPlegable>
            <CardPlegable title="Generadores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="generadores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.generadores?.length > 0 ? editData.generadores : []) : (formData.generadores || [])}
                    ItemComponent={GeneradoresTransportistas}
                />
            </CardPlegable>
            <CardPlegable title="Conductores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="conductores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.conductores?.length > 0 ? editData.conductores : []) : (formData.conductores || [])}
                    ItemComponent={Conductores}
                />
            </CardPlegable>
            {!editData && (<div className="flex justify-center mt-6">
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
            )}
        </div >
    )

}

export default RegisterTransportistas