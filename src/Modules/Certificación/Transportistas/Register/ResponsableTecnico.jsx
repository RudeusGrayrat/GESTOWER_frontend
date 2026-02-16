import Input from "../../../../recicle/Inputs/Inputs";

const ResponsableTecnico = ({ formData, setFormData }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            responsableTecnico: {
                ...prev.responsableTecnico,
                [field]: value
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="Nombre del Responsable Técnico"
                value={formData.responsableTecnico?.nombre || ""}
                onChange={(e) => handleChange('nombre', e.target.value.toUpperCase())}
                placeholder="Nombres y apellidos"
            />

            <Input
                label="N° de Colegiatura"
                value={formData.responsableTecnico?.numeroColegiatura || ""}
                onChange={(e) => handleChange('numeroColegiatura', e.target.value.toUpperCase())}
                placeholder="Ej: CIP 123456"
            />
        </div>
    );
};

export default ResponsableTecnico;