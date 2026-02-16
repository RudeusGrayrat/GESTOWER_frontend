import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Paso1_DatosGenerales from "./DatosGenerales";
import Paso2_Residuo from "./Residuo";
import Paso3_Peligrosidad from "./Peligrosidad";
import Paso4_Transporte from "./Transporte";
import Paso5_Destino from "./Destino";
import Paso6_Contingencias from "./Contingencia";
import Paso7_Firmas from "./Firmas";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios";

const RegisterManifiestos = () => {
    const sendMessage = useSendMessage();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [pasoActual, setPasoActual] = useState(1);

    const [formData, setFormData] = useState({
        // Autogenerado
        numeroManifiesto: `MRSP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        año: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,

        // Paso 1
        generadorId: '',
        plantaId: '',

        // Paso 2
        residuo: {
            descripcion: '',
            cantidadTotal: '',
            estadoFisico: 'SOLIDO',
            recipiente: {
                tipo: '',
                material: '',
                numero: 1
            },
            codigoBasilea: '',
            subcodigoBasilea: '',
            informacionAdicional: ''
        },

        // Paso 3 (19 checkboxes)
        peligrosidad: {
            explosivos: false,
            oxidantes: false,
            gasesToxicos: false,
            liquidosInflamables: false,
            peroxidosOrganicos: false,
            toxicosCronicos: false,
            solidosInflamables: false,
            toxicosAgudos: false,
            ecotoxicos: false,
            combustionEspontanea: false,
            sustanciasInfecciosas: false,
            sustanciasSecundarias: false,
            gasesInflamablesAgua: false,
            corrosivos: false,
            otros: ''
        },

        // Paso 4
        transportistaId: '',
        transporte: {
            nombreConductor: '',  // ← DEL EXCEL: "Nombre del conductor"
            tipoVehiculo: '',     // ← DEL EXCEL: "Tipo de vehículo"
            placaVehiculo: '',    // ← DEL EXCEL: "N° placa del vehículo"
            fechaRecepcion: '',
            cantidadRecibida: '',
            observaciones: ''
        },

        // Paso 5
        destinoId: '',
        tipoManejoSeleccionado: '',
        otrosManejos: {              // NUEVO (sección 3.3)
            comercializacion: {},
            exportacion: {},
            otro: {}
        },
        devolucion: {                 // NUEVO (sección 4.2)
            representanteEors: {},
            responsableGenerador: {}
        },
        destinoFinal: {
            cantidadEntregada: '',
            observaciones: ''
        },

        // Paso 6
        contingencias: {
            derrame: '',
            infiltracion: '',
            incendio: '',
            explosion: '',
            otros: ''
        },

        // Paso 7 (se llenarán después)
        referendoEntrega: {
            firmaGenerador: '',
            nombreGenerador: '',
            firmaTransportista: '',
            nombreTransportista: '',
            dniTransportista: '',
            cargoTransportista: '',
            fechaHora: ''
        },
        referendoRecepcion: {
            firmaDestino: '',
            nombreDestino: '',
            dniDestino: '',
            cargoDestino: '',
            fechaHora: ''
        },

        estado: 'REGISTRADO'
    });

    const pasos = [
        { id: 1, nombre: "Generador", componente: Paso1_DatosGenerales },
        { id: 2, nombre: "Residuo", componente: Paso2_Residuo },
        { id: 3, nombre: "Peligrosidad", componente: Paso3_Peligrosidad },
        { id: 4, nombre: "Transporte", componente: Paso4_Transporte },
        { id: 5, nombre: "Destino", componente: Paso5_Destino },
        { id: 6, nombre: "Contingencias", componente: Paso6_Contingencias },
        { id: 7, nombre: "Firmas", componente: Paso7_Firmas }
    ];

    const PasoComponente = pasos[pasoActual - 1]?.componente;

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
                recipiente: { tipo: '', material: '', numero: 1 },
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
            contingencias: { derrame: '', infiltracion: '', incendio: '', explosion: '', otros: '' },
            referendoEntrega: { firmaGenerador: '', nombreGenerador: '', firmaTransportista: '', nombreTransportista: '', dniTransportista: '', cargoTransportista: '', fechaHora: '' },
            referendoRecepcion: { firmaDestino: '', nombreDestino: '', dniDestino: '', cargoDestino: '', fechaHora: '' },
            estado: 'REGISTRADO'
        });
        setPasoActual(1);
    };
    console.log("FormData actual:", formData); // Agrega este log para depuración
    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />

            {/* Barra de progreso */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {pasos.map(paso => (
                        <div key={paso.id} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pasoActual >= paso.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                                }`}>
                                {paso.id}
                            </div>
                            <span className="text-xs mt-1">{paso.nombre}</span>
                        </div>
                    ))}
                </div>
                <div className="relative mt-2">
                    <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300"
                        style={{ width: `${(pasoActual / pasos.length) * 100}%` }} />
                    <div className="w-full h-1 bg-gray-200" />
                </div>
            </div>

            {/* Número de Manifiesto (visible siempre) */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">N° Manifiesto: </span>
                <span className="font-mono">{formData.numeroManifiesto}</span>
            </div>

            {/* Paso actual */}
            <CardPlegable title={`Paso ${pasoActual}: ${pasos[pasoActual - 1].nombre}`}>
                <PasoComponente formData={formData} setFormData={setFormData} />
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
                        onClick={resetForm}
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
                            onClick={register}
                            disabled={deshabilitar}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterManifiestos;