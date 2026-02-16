import { useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Paso5_Destino = ({ formData, setFormData }) => {
    const [destinoOptions, setDestinoOptions] = useState([]);

    const tipoManejoOptions = [
        { value: "TRATAMIENTO", label: "Tratamiento" },
        { value: "VALORIZACION", label: "Valorización" },
        { value: "DISPOSICION_FINAL", label: "Disposición Final" }
    ];

    const handleDestinoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            destinoFinal: {
                ...prev.destinoFinal,
                [campo]: valor
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="EO-RS Destino Final *"
                type="autocomplete"
                name="destinoId"
                value={formData.destinoId}
                setForm={setFormData}
                fetchData="/certificaciones/getDestinosPaginacion"
                setOptions={setDestinoOptions}
                options={destinoOptions}
                field="razonSocial"
                placeholder="Buscar destino por RUC o razón social"
            />

            <Input
                label="Cantidad entregada (toneladas)"
                type="number"
                step="0.01"
                value={formData.destinoFinal?.cantidadEntregada || ""}
                onChange={(e) => handleDestinoChange('cantidadEntregada', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <Input
                label="Observaciones"
                value={formData.destinoFinal?.observaciones || ""}
                onChange={(e) => handleDestinoChange('observaciones', e.target.value)}
                placeholder="Observaciones del destino final"
                ancho="w-full"
            />
        </div>
    );
};

export default Paso5_Destino;