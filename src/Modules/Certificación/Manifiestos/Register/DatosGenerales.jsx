import { useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Paso1_DatosGenerales = ({ formData, setFormData }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [generadorOptions, setGeneradorOptions] = useState([]);
    const [plantaOptions, setPlantaOptions] = useState([]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="EO-RS Transportista *"
                type="autocomplete"
                name="transportistaId"
                value={formData.transportistaId}
                setForm={setFormData}
                fetchData="/certificaciones/getTransportistasPaginacion"
                setOptions={setTransportistaOptions}
                options={transportistaOptions}
                field="razonSocial"
                placeholder="Buscar transportista por RUC o razón social"
            />
            <Input
                label="Generador"
                type="autocomplete"
                name="generadorId"
                value={formData.generadorId}
                setForm={setFormData}
                fetchData={`/certificaciones/getGeneradoresByTransportista/${formData.transportistaId?._id || formData.transportistaId}`}
                setOptions={setGeneradorOptions}
                options={generadorOptions}
                field="razonSocial"
                placeholder="Buscar generador por RUC o razón social"
                disabled={!formData.transportistaId}
            />
            <Input
                label="Planta/Instalación"
                type="autocomplete"
                name="plantaId"
                value={formData.plantaId}
                setForm={setFormData}
                fetchData={`/certificaciones/getPlantasByGenerador/${formData?.generadorId?._id || formData?.generadorId}`}
                setOptions={setPlantaOptions}
                options={plantaOptions}
                field="direccion"
                placeholder={formData.generadorId ? "Seleccionar planta" : "Primero seleccione un generador"}
                disabled={!formData.generadorId}
            />
        </div>
    );
};

export default Paso1_DatosGenerales;