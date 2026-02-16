import { useState, useEffect } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";

const Paso1_DatosGenerales = ({ formData, setFormData }) => {
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [plantaOptions, setPlantaOptions] = useState([]);

    // Cargar plantas cuando cambia el generador
    useEffect(() => {
        if (formData.generadorId) {
            fetchPlantas(formData.generadorId);
        }
    }, [formData.generadorId]);

    const fetchPlantas = async (generadorId) => {
        try {
            const response = await axios.get(`/certificaciones/getPlantasByGenerador/${generadorId._id}`);
            setPlantaOptions(response.data.plantas || []);
        } catch (error) {
            console.error("Error fetching plantas:", error);
        }
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="Generador"
                type="autocomplete"
                name="generadorId"
                value={formData.generadorId}
                setForm={setFormData}
                fetchData="/certificaciones/getGeneradoresPaginacion"
                setOptions={setGeneradorOptions}
                options={generadorOptions}
                field="razonSocial"
                placeholder="Buscar generador por RUC o razón social"
            />

            <Input
                label="Planta/Instalación"
                type="select"
                name="plantaId"
                value={formData.plantaId}
                setForm={setFormData}
                options={plantaOptions}
                optionLabel="denominacion"
                placeholder={formData.generadorId ? "Seleccionar planta" : "Primero seleccione un generador"}
                disabled={!formData.generadorId}
            />
        </div>
    );
};

export default Paso1_DatosGenerales;