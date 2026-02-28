import { useState, useEffect } from "react";
import { deepDiff } from "../../../validateEdit";
// import Edit from "../../../../components/Principal/Permissions/Edit";
import PopUp from "../../../../recicle/popUps";
import RegisterManifiestos from "../Register/Register";
import useSendMessage from "../../../../recicle/senMessage";
import { setMessage } from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import axios from "../../../../api/axios";
import dayjs from "dayjs";

const EditManifiesto = ({ setShowEdit, selected, reload }) => {
    const sendMessage = useSendMessage();
    const dispatch = useDispatch();
    const [deshabilitar, setDeshabilitar] = useState(false);

    // 🔥 IMPORTANTE: Normalizar los datos para edición
    const [formData, setFormData] = useState(() => {
        // Asegurar que todos los campos tengan la estructura correcta
        return {
            ...selected,
            generadorId: selected.generadorId,
            plantaId: selected.plantaId,
            servicioTransporte: selected.transportistaId?.razonSocial?.includes("TOWER") ? selected.transportistaId.razonSocial : 'SERVICIO EO',
            transportistaId: selected.transportistaId,
            destinoId: selected.destinoId,

            // Asegurar objetos anidados
            residuo: {
                descripcion: selected.residuo?.descripcion || '',
                cantidadTotal: selected.residuo?.cantidadTotal || '',
                estadoFisico: selected.residuo?.estadoFisico || 'SOLIDO',
                tipoRecipiente: selected.residuo?.tipoRecipiente || '',
                materialRecipiente: selected.residuo?.materialRecipiente || '',
                numeroRecipientes: selected.residuo?.numeroRecipientes || 1,
                codigoBasilea: selected.residuo?.codigoBasilea || '',
                subcodigoBasilea: selected.residuo?.subcodigoBasilea || '',
                informacionAdicional: selected.residuo?.informacionAdicional || ''
            },

            transporte: {
                nombreConductor: selected.transporte?.nombreConductor || '',
                tipoVehiculo: selected.transporte?.tipoVehiculo || '',
                placaVehiculo: selected.transporte?.placaVehiculo || '',
                fechaRecepcion: dayjs(selected.transporte?.fechaRecepcion).format("YYYY-MM-DD") || '',
                cantidadRecibida: selected.transporte?.cantidadRecibida || '',
                observaciones: selected.transporte?.observaciones || ''
            },
            tipoManejoSeleccionado: selected.tipoManejoSeleccionado,
            destinoFinal: {
                cantidadEntregada: selected.destinoFinal?.cantidadEntregada || '',
                observaciones: selected.destinoFinal?.observaciones || ''
            },

            // ... asegurar todos los objetos anidados
        };
    });

    const [formEdit, setFormEdit] = useState({});

    // Detectar cambios
    const changes = deepDiff(formData, formEdit);

    const upDate = async () => {
        setDeshabilitar(true);
        setMessage("Actualizando manifiesto...", "Cargando");

        try {
            if (Object.keys(changes).length === 0) {
                sendMessage("No hay cambios para guardar", "Advertencia");
                return;
            }

            // Preparar datos para enviar
            const datosEnvio = {
                _id: selected._id,
                ...changes,
                // Asegurar que los IDs sean strings, no objetos
                generadorId: changes.generadorId?._id || changes.generadorId,
                plantaId: changes.plantaId?._id || changes.plantaId,
                transportistaId: changes.transportistaId?._id || changes.transportistaId,
                destinoId: changes.destinoId?._id || changes.destinoId,
            };

            const response = await axios.patch("/certificaciones/patchManifiesto", datosEnvio);
            const data = response.data;

            sendMessage(data.message, data.type || "Correcto");

            if (data.type === "Correcto") {
                reload();
                setShowEdit(false);
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al actualizar manifiesto", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    // Determinar qué campos deshabilitar según el estado
    const getDisabledFields = () => {
        const disabled = {};

        switch (selected.estado) {
            case 'APROBADO':
            case 'RECHAZADO':
                // No se puede editar nada
                return {
                    generadorId: true,
                    plantaId: true,
                    residuo: true,
                    peligrosidad: true,
                    transportistaId: true,
                    transporte: true,
                    destinoId: true,
                    destinoFinal: true,
                    referendos: true
                };

            case 'EN_REVISION':
                // Solo el operador puede editar ciertos campos
                return {
                    // Deshabilitar todo lo del cliente
                    generadorId: true,
                    plantaId: true,
                    residuo: true,
                    peligrosidad: true,
                    // Habilitar lo del operador
                    transportistaId: false,
                    transporte: false,
                    destinoId: false,
                    destinoFinal: false,
                    referendos: false
                };

            case 'OBSERVADO':
                // El cliente puede editar todo
                return {};

            default:
                return {};
        }
    };

    const disabledFields = getDisabledFields();
    console.log("Deep Diff Changes:", changes);
    return (
        <div className="w-[90%] h-[93%] bg-white flex flex-col justify-center
            border-gray-100 border shadow-2xl fixed top-5 z-40 rounded-xl">

            <PopUp deshabilitar={deshabilitar} />

            <div className="flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
                <RegisterManifiestos
                    // Pasar datos para edición
                    formEdit={formData}
                    setFormEdit={setFormEdit}

                    // Funciones de edición
                    editUpdate={upDate}
                    editCancel={() => setShowEdit(false)}

                    // 🔥 Pasar campos deshabilitados
                    disabledFields={disabledFields}
                />
            </div>
        </div>
    );
};

export default EditManifiesto;