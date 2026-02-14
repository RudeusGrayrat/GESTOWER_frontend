import Input from "../../../../recicle/Inputs/Inputs";

const IgaInfo = ({ form, setForm }) => {
    const handleTieneIgaChange = (e) => {
        const tieneIga = e.target.checked;
        setForm(prev => ({
            ...prev,
            tieneIga,
            // Resetear campos si cambia a false
            ...(!tieneIga && {
                igaAprobadoPor: "",
                fechaAprobacionIga: "",
                numeroResolucionIga: ""
            })
        }));
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <Input
                    label="¿Cuenta con IGA aprobado?"
                    type="checkbox"
                    name="tieneIga"
                    value={form.tieneIga}
                    setForm={setForm}
                    checkboxLabel="Sí, cuenta con Instrumento de Gestión Ambiental"
                />
            </div>

            {form.tieneIga && (
                <>
                    <Input
                        label="Institución que aprueba"
                        type="text"
                        name="igaAprobadoPor"
                        value={form.igaAprobadoPor}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                    <Input
                        label="Fecha de Aprobación"
                        type="date"
                        name="fechaAprobacionIga"
                        value={form.fechaAprobacionIga}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                    <Input
                        label="N° de Resolución"
                        type="text"
                        name="numeroResolucionIga"
                        value={form.numeroResolucionIga}
                        setForm={setForm}
                        ancho="w-full"
                        required
                    />
                </>
            )}
        </div>
    );
};

export default IgaInfo;