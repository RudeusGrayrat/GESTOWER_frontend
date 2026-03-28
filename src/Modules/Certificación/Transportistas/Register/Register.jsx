import { useState } from "react";
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import Contingencias from "./Contingencias";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import GeneradoresTransportistas from "./Generadores";
import Conductores from "./Conductores";
import Representante_y_Responsable from "./Representante_y_Responsable";
import Responsables from "./Responsables";

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
        representanteLegal: {
            nombre: '',
            dni: '',
        },
        responsableTecnico: {
            nombre: '',
            numeroColegiatura: '',
        },
        responsables: [
            {
                nombre: '',
                dni: '',
                cargo: '',
                firmaResponsable: '',
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
    const validateForm = () => {
        if (!formData.razonSocial) return "Falta razón social";
        if (!formData.ruc) return "Falta RUC";
        if (!formData.registroEors) return "Falta Registro EO-RS";
        if (!formData.direccion) return "Falta dirección";
        if (!formData.ubigeoId) return "Falta ubigeo";
        if (!formData.correoElectronico) return "Falta correo electrónico";
        if (!formData.telefono) return "Falta teléfono";
        return null;
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
            },
            responsables: [],
            contingencias: {
                derrame: '',
                infiltracion: '',
                incendio: '',
                explosion: '',
                otros: ''
            },
            generadores: [],
            conductores: []
        });
    }
    const register = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando transportista...", "Cargando");

        try {
            const errorMsg = validateForm();
            if (errorMsg) {
                sendMessage(errorMsg, "Info");
                return;
            }

            // Validar RUC (11 dígitos)
            if (!/^\d{11}$/.test(String(formData.ruc))) {
                sendMessage("El RUC debe tener 11 dígitos numéricos", "Advertencia");
                return;
            }
            const newData = {
                ...formData,
                generadores: formData.generadores.map(gen => gen._id)
            }
            const response = await axios.post("/certificaciones/postTransportista", newData);
            const data = response.data;
            sendMessage(data.message, data.type || "Correcto");
            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
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
            <CardPlegable title="Representante y Responsable Técnico">
                <Representante_y_Responsable formData={editData ? editData : formData} setFormData={setFormEdit ? setFormEdit : setFormData} />
            </CardPlegable>
            <CardPlegable title="Responsables">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="responsables"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.responsables?.length > 0 ? editData.responsables : []) : (formData.responsables)}
                    ItemComponent={Responsables}
                />
            </CardPlegable>
            <CardPlegable title="Generadores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="generadores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.generadores?.length > 0 ? editData.generadores : []) : (formData.generadores)}
                    ItemComponent={GeneradoresTransportistas}
                />
            </CardPlegable>
            <CardPlegable title="Conductores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="conductores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.conductores?.length > 0 ? editData.conductores : []) : (formData.conductores)}
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