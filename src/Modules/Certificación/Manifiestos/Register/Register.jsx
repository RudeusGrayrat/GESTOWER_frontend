import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Paso1_DatosGenerales from "./DatosGenerales";
import Paso2_Residuo from "./Residuo";
import Paso3_Peligrosidad from "./Peligrosidad";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";
import Paso4_OtrasObligaciones from "./OtrasObligaciones";
import { ProgressBar } from "primereact/progressbar";

const RegisterManifiestos = ({ editUpdate, editCancel, formEdit, setFormEdit }) => {

    const sendMessage = useSendMessage();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [pasoActual, setPasoActual] = useState(1);
    const { user } = useAuth();

    const [formData, setFormData] = useState(formEdit || {
        // Autogenerado
        numeroManifiesto: `MRSP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        año: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,


        estado: 'PENDIENTE'
    });

    const pasos = [
        { id: 1, nombre: "Datos generales", componente: Paso1_DatosGenerales },
        { id: 2, nombre: "Residuos peligroso", componente: Paso2_Residuo },
        { id: 3, nombre: "Manejo de residuo", componente: Paso3_Peligrosidad },
        { id: 4, nombre: "Otras Observaciones", componente: Paso4_OtrasObligaciones },
    ];

    const PasoComponente = pasos[pasoActual - 1]?.componente;
    const resetForm = () => {
        setFormData({
            numeroManifiesto: `MRSP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            año: new Date().getFullYear(),
            mes: new Date().getMonth() + 1,
            generadorId: '',
            plantaId: '',
            residuo: {
                descripcion: '',
                cantidadTotal: '',
                estadoFisico: 'SOLIDO',
                tipoRecipiente: '',
                materialRecipiente: '',
                numeroRecipientes: 1,
                codigoBasilea: '',
                subcodigoBasilea: '',
                informacionAdicional: ''
            },
            peligrosidad: {
                explosivos: false, oxidantes: false, gasesToxicos: false,
                liquidosInflamables: false, peroxidosOrganicos: false,
                toxicosCronicos: false, solidosInflamables: false,
                toxicosAgudos: false, ecotoxicos: false,
                combustionEspontanea: false, sustanciasInfecciosas: false,
                sustanciasSecundarias: false, gasesInflamablesAgua: false,
                corrosivos: false, otros: ''
            },
            transportistaId: '',
            transporte: { fechaRecepcion: '', cantidadRecibida: '', observaciones: '' },
            destinoId: '',
            destinoFinal: { cantidadEntregada: '', observaciones: '' },
            referendoEntrega: { firmaGenerador: '', nombreGenerador: '', firmaTransportista: '', nombreTransportista: '', dniTransportista: '', cargoTransportista: '', fechaHora: '' },
            referendoRecepcion: { firmaDestino: '', nombreDestino: '', dniDestino: '', cargoDestino: '', fechaHora: '' },
        });
        setPasoActual(1);
    };
    const register = async () => {
        setDeshabilitar(true);
        setMessage("Registrando manifiesto...", "Cargando");

        try {
            // Validar paso 1
            if (!formData.generadorId || !formData.plantaId) {
                sendMessage("Debe seleccionar generador y planta", "Advertencia");
                setPasoActual(1);
                return;
            }

            // Validar paso 2
            if (!formData.residuo.descripcion || !formData.residuo.cantidadTotal || !formData.residuo.estadoFisico) {
                sendMessage("Complete los datos del residuo", "Advertencia");
                setPasoActual(2);
                return;
            }

            // Validar paso 4
            if (!formData.transportistaId || !formData.transporte.fechaRecepcion) {
                sendMessage("Complete los datos de transporte", "Advertencia");
                setPasoActual(4);
                return;
            }

            // Validar paso 5
            if (!formData.destinoId) {
                sendMessage("Seleccione el destino final", "Advertencia");
                setPasoActual(5);
                return;
            }
            const datosEnvio = {
                ...formData,
                generadorId: formData.generadorId?._id || formData.generadorId,
                plantaId: formData.plantaId?._id || formData.plantaId,
                transportistaId: formData.transportistaId?._id || formData.transportistaId,
                destinoId: formData.destinoId?._id || formData.destinoId,
                creadoPor: user._id
            };
            const response = await axios.post("/certificaciones/postManifiesto", datosEnvio);
            const data = response.data;

            sendMessage(data.message, data.type || "Correcto");

            if (data.type === "Correcto") {
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al registrar manifiesto", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    console.log("FormData actual:", formData); // Agrega este log para depuración
    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />

            {/* Barra de progreso */}
            <div className="mb-4 mx-4">
                <ProgressBar style={{ borderRadius: "20px" }} value={(pasoActual / pasos.length) * 100}></ProgressBar>
            </div>

            {/* Paso actual */}
            <CardPlegable title={` ${pasos[pasoActual - 1].nombre}`}>
                <PasoComponente formData={formData} setFormData={setFormEdit || setFormData} />
            </CardPlegable>

            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
                <ButtonOk
                    children="Anterior"
                    classe="!w-32"
                    onClick={() => setPasoActual(prev => Math.max(1, prev - 1))}
                    disabled={pasoActual === 1 || deshabilitar}
                />

                <div className="flex space-x-4">
                    <ButtonOk
                        children="Cancelar"
                        classe="!w-32"
                        onClick={editCancel !== null ? editCancel : resetForm}
                        disabled={deshabilitar}
                    />

                    {pasoActual < pasos.length ? (
                        <ButtonOk
                            type="ok"
                            children="Siguiente"
                            classe="!w-32"
                            onClick={() => setPasoActual(prev => prev + 1)}
                        />
                    ) : (
                        <ButtonOk
                            type="ok"
                            children="Registrar"
                            classe="!w-32"
                            onClick={editUpdate ? editUpdate : register}
                            disabled={deshabilitar}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterManifiestos;