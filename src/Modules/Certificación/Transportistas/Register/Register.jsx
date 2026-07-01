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

const RegisterTransportistas = ({ editData, setFormEdit }) => {
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
        usuarioManifestower: false,
        representanteLegal: { nombre: '', dni: '' },
        responsableTecnico: { nombre: '', numeroColegiatura: '' },
        responsables: [{ nombre: '', dni: '', cargo: '', firmaResponsable: '' }],
        contingencias: { derrame: '', infiltracion: '', incendio: '', explosion: '', otros: '' },
        generadores: [
            {
                generadorId: null, // Guardará el objeto completo seleccionado
                tienePermisoLlenado: false
            }
        ],
        conductores: [{ nombre: "", licencia: "" }]
    });

    const validateForm = () => {
        const data = editData || formData;
        if (!data.razonSocial) return "Falta razón social";
        if (!data.ruc) return "Falta RUC";
        if (!data.registroEors) return "Falta Registro EO-RS";
        if (!data.direccion) return "Falta dirección";
        if (!data.ubigeoId) return "Falta ubigeo";
        if (!data.correoElectronico) return "Falta correo electrónico";
        if (!data.telefono) return "Falta teléfono";
        return null;
    };

    const resetForm = () => {
        setFormData({
            razonSocial: '', ruc: '', registroEors: '', autorizacionMunicipal: '', documentoRuta: '',
            direccion: '', ubigeoId: '', correoElectronico: '', telefono: '', usuarioManifestower: false,
            representanteLegal: { nombre: '', dni: '' },
            responsableTecnico: { nombre: '', numeroColegiatura: '' },
            responsables: [],
            contingencias: { derrame: '', infiltracion: '', incendio: '', explosion: '', otros: '' },
            generadores: [],
            conductores: []
        });
    };

    const register = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando transportista...", "Cargando");

        try {
            const errorMsg = validateForm();
            if (errorMsg) { sendMessage(errorMsg, "Info"); return; }

            if (!/^\d{11}$/.test(String(formData.ruc))) {
                sendMessage("El RUC debe tener 11 dígitos numéricos", "Advertencia");
                return;
            }

            // 🌟 PROCESAMOS PARA EL BACKEND: Enviamos solo los IDs dentro de la estructura relacional
            const generadoresPayload = (formData.generadores || [])
                .map(g => {
                    const id = g.generadorId?._id || g.generadorId;
                    return id ? { generadorId: id, tienePermisoLlenado: g.tienePermisoLlenado || false } : null;
                })
                .filter(Boolean);

            const newData = {
                ...formData,
                ubigeoId: formData.ubigeoId?._id || formData.ubigeoId,
                generadores: generadoresPayload
            };

            console.log("Datos a enviar al backend", newData);
            const response = await axios.post("/certificaciones/postTransportista", newData);
            const data = response.data;
            sendMessage(data.message, data.type || "Correcto");
            if (data.type === "Correcto") resetForm();
        } catch (error) {
            sendMessage(error.response?.data?.message || "Error al registrar transportista", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    // Determinamos qué array de generadores renderizar basándonos en si estamos editando o creando
    const currentGeneradores = editData ? (editData.generadores?.length > 0 ? editData.generadores : []) : formData.generadores;

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
                    directory={editData ? (editData.responsables?.length > 0 ? editData.responsables : []) : formData.responsables}
                    ItemComponent={Responsables}
                />
            </CardPlegable>
            <CardPlegable title="Generadores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="generadores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={currentGeneradores} // 🌟 Mandamos el objeto relacional íntegro
                    ItemComponent={GeneradoresTransportistas}
                />
            </CardPlegable>
            <CardPlegable title="Conductores">
                <Directorio
                    estilos="flex justify-center items-center"
                    data="conductores"
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? (editData.conductores?.length > 0 ? editData.conductores : []) : formData.conductores}
                    ItemComponent={Conductores}
                />
            </CardPlegable>
            {!editData && (
                <div className="flex justify-center mt-6">
                    <ButtonOk children="Cancelar" classe="!w-32 mr-4" onClick={() => resetForm()} disabled={deshabilitar} />
                    <ButtonOk type="ok" onClick={register} classe="!w-32" children="Registrar" disabled={deshabilitar} />
                </div>
            )}
        </div>
    );
};

export default RegisterTransportistas;