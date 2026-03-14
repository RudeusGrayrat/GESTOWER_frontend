import Input from "../../../../recicle/Inputs/Inputs";

const Responsable_y_Representante = ({ formData, setFormData }) => {
    const handleChangeResponsableTecnico = (field, value) => {
        setFormData(prev => ({
            ...prev,
            responsableTecnico: {
                ...prev.responsableTecnico,
                [field]: value
            }
        }));
    };
    const handleChangeRepresentanteLegal = (field, value) => {
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
                ancho="!w-96"
                label="Nombre del Responsable Técnico"
                value={formData.responsableTecnico?.nombre || ""}
                onChange={(e) => handleChangeResponsableTecnico('nombre', e.target.value.toUpperCase())}
                placeholder="Nombres y apellidos"
            />

            <Input
                label="N° de Colegiatura"
                value={formData.responsableTecnico?.numeroColegiatura || ""}
                onChange={(e) => handleChangeResponsableTecnico('numeroColegiatura', e.target.value.toUpperCase())}
                placeholder="Ej: CIP 123456"
            />
            <Input
                label="Nombre del Representante Legal"
                value={formData.representanteLegal?.nombre || ""}
                onChange={(e) => handleChangeRepresentanteLegal('nombre', e.target.value.toUpperCase())}
                ancho="!w-96"
                placeholder="Nombres y apellidos completos"
            />

            <Input
                label="DNI/CE del Representante Legal"
                value={formData.representanteLegal?.dni || ""}
                onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    handleChangeRepresentanteLegal('dni', soloNumeros.slice(0, 12));
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

export default Responsable_y_Representante;