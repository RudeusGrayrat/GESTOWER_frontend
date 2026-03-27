import Input from "../../../../recicle/Inputs/Inputs";

const Representante_y_Responsable = ({ formData, setFormData }) => {
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
                label="Nombre del Representante Legal"
                name="nombreRepresentante"
                value={formData.representanteLegal?.nombre || ""}
                setForm={(name, value) => handleChangeRepresentanteLegal(name, value)}
                placeholder="Nombres y apellidos"
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
            <Input
                ancho="!w-96"
                label="Nombre del Responsable Técnico"
                name="nombre"
                value={formData.representanteTecnico?.nombre || ""}
                setForm={(name, value) => handleChangeResponsableTecnico(name, value)}
                placeholder="Nombres y apellidos "
            />
            <Input
                label="N° de Colegiatura"
                name="numeroColegiatura"
                value={formData.representanteTecnico?.numeroColegiatura || ""}
                setForm={(name, value) => handleChangeResponsableTecnico(name, value)}
                placeholder="Ej: CIP 123456"
            />

        </div>

    );
};

export default Representante_y_Responsable;