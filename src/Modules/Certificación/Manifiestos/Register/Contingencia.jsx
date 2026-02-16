import Input from "../../../../recicle/Inputs/Inputs";

const Paso6_Contingencias = ({ formData, setFormData }) => {
    const handleContingenciaChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            contingencias: {
                ...prev.contingencias,
                [campo]: valor
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <p className="text-sm text-gray-600 mb-4 w-full">
                Detalle las medidas de contingencia del Plan aprobado, o las medidas a adoptar en caso de eventos no previstos:
            </p>

            <Input
                label="Derrame"
                value={formData.contingencias?.derrame || ""}
                onChange={(e) => handleContingenciaChange('derrame', e.target.value)}
                placeholder="Medidas en caso de derrame"
                ancho="w-full"
            />

            <Input
                label="Infiltración"
                value={formData.contingencias?.infiltracion || ""}
                onChange={(e) => handleContingenciaChange('infiltracion', e.target.value)}
                placeholder="Medidas en caso de infiltración"
                ancho="w-full"
            />

            <Input
                label="Incendio"
                value={formData.contingencias?.incendio || ""}
                onChange={(e) => handleContingenciaChange('incendio', e.target.value)}
                placeholder="Medidas en caso de incendio"
                ancho="w-full"
            />

            <Input
                label="Explosión"
                value={formData.contingencias?.explosion || ""}
                onChange={(e) => handleContingenciaChange('explosion', e.target.value)}
                placeholder="Medidas en caso de explosión"
                ancho="w-full"
            />

            <Input
                label="Otros accidentes"
                value={formData.contingencias?.otros || ""}
                onChange={(e) => handleContingenciaChange('otros', e.target.value)}
                placeholder="Otras medidas de contingencia"
                ancho="w-full"
            />
        </div>
    );
};

export default Paso6_Contingencias;