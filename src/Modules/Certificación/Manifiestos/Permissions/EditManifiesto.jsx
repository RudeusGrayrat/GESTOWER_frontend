import { useState, useEffect } from "react";
import { deepDiff } from "../../../validateEdit";
import RegisterManifiestos from "../Register/Register";
import useSendMessage from "../../../../recicle/senMessage";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios";
import dayjs from "dayjs";
import { useAuth } from "../../../../context/AuthContext";

const EditManifiesto = ({ setShowEdit, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    // 🔥 IMPORTANTE: Normalizar los datos para edición
    const [formData, setFormData] = useState({
        ...selected
    });

    const [formEdit, setFormEdit] = useState(formData);
    console.log("Datos para edición:", formData);
    console.log("Datos originales:", selected);
    console.log("Diferencias detectadas:", deepDiff(formData, selected));
    console.log("Diferencias detectadas (formEdit):", deepDiff(formEdit, selected));
    // Detectar cambios
    const changes = deepDiff(formData, formEdit);
    console.log("Cambios detectados:", changes);
    const upDate = async () => {
        setMessage("Actualizando manifiesto...", "Cargando", true);

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
                modificadoPor: user._id
            };

            const response = await axios.patch(`/certificaciones/patchManifiesto/${selected._id}/`, datosEnvio);
            const data = response.data;

            sendMessage(data.message, data.type || "Correcto");

            if (data.type === "Correcto") {
                reload();
            }
        } catch (error) {
            console.error("Error:", error);
            sendMessage(error.response?.data?.message || "Error al actualizar manifiesto", "Error");
        } finally {
            setShowEdit(false);
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
    return (
        <div className="w-[90%] h-[93%] bg-white flex flex-col justify-center
            border-gray-100 border shadow-2xl fixed top-5 z-40 rounded-xl">


            <div className="flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
                <RegisterManifiestos
                    // Pasar datos para edición
                    formEdit={formEdit}
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