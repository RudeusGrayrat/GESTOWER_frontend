import Input from "../../../../recicle/Inputs/Inputs";

const RepresentanteLegal = ({ formData, setFormData }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            representanteLegal: {
                ...prev.representanteLegal,
                [field]: value
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="Nombre del Representante Legal *"
                value={formData.representanteLegal?.nombre || ""}
                onChange={(e) => handleChange('nombre', e.target.value.toUpperCase())}
                placeholder="Nombres y apellidos completos"
            />

            <Input
                label="DNI/CE del Representante Legal *"
                value={formData.representanteLegal?.dni || ""}
                onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    handleChange('dni', soloNumeros.slice(0, 12));
                }}
                maxLength={12}
                placeholder="Ej: 12345678"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
        </div>
    );
};

export default RepresentanteLegal;