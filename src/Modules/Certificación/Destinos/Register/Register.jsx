import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import RepresentanteLegal from "./RepresentanteLegal";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios";
import DatosDestino from "./DatosDestino";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import Responsables from "./Responsables";

const RegisterDestinos = ({ editData, setFormEdit }) => {
    const sendMessage = useSendMessage();

    const [formData, setFormData] = useState({
        razonSocial: '',
        ruc: '',
        codigoRegistroEors: '',
        autorizacionMunicipal: '',
        tipoManejo: 'TRATAMIENTO',
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
        estado: 'ACTIVO'
    });

    const resetForm = () => {
        setFormData({
            razonSocial: '',
            ruc: '',
            codigoRegistroEors: '',
            autorizacionMunicipal: '',
            tipoManejo: 'TRATAMIENTO',
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
            estado: 'ACTIVO'
        });
    };
    const register = async () => {
        setMessage("Registrando destino...", "Cargando", true);

        try {
            // Validaciones básicas
            const camposObligatorios = [
                { campo: formData.razonSocial, nombre: "Razón Social" },
                { campo: formData.ruc, nombre: "RUC" },
                { campo: formData.codigoRegistroEors, nombre: "Código Registro EO-RS" },
                { campo: formData.tipoManejo, nombre: "Tipo de Manejo" },
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
            const soloIdUbigeo = typeof formData.ubigeoId === 'object' ? formData.ubigeoId._id : formData.ubigeoId;
            const dataToSend = {
                ...formData,
                ubigeoId: soloIdUbigeo,
            };
            const response = await axios.post("/certificaciones/postDestino", dataToSend);
            const data = response.data;

            sendMessage(data.message, data.type || "Correcto");

            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al registrar destino", "Error");
        }
    };

    return (
        <div className="w-full p-4">

            <CardPlegable title="Datos Básicos del Destino">
                <DatosDestino formData={editData ? editData : formData} setFormData={setFormEdit ? setFormEdit : setFormData} />
            </CardPlegable>

            <CardPlegable title="Representante Legal y Responsable Tecnico">
                <RepresentanteLegal formData={editData ? editData : formData} setFormData={setFormEdit ? setFormEdit : setFormData} />
            </CardPlegable>

            <CardPlegable title="Responsables">
                <Directorio
                    ItemComponent={Responsables}
                    setForm={setFormEdit ? setFormEdit : setFormData}
                    directory={editData ? editData.responsables : formData.responsables}
                    data="responsables"
                    estilos="flex justify-center items-center"
                />
            </CardPlegable>

            {!editData && <div className="flex justify-center mt-6">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-32 mr-4"
                    onClick={resetForm}
                />
                <ButtonOk
                    type="ok"
                    onClick={register}
                    classe="!w-32"
                    children="Registrar"
                />
            </div>}
        </div>
    );
};

export default RegisterDestinos;