import Input from "../../../../recicle/Inputs/Inputs";

const Paso6_OtrasObligaciones = ({ formData, setFormData }) => {
    const handleOtrasObligacionesChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            otrasObligaciones: {
                ...prev.otrasObligaciones,
                [campo]: valor
            }
        }));
    }
    return (
        <div className="w-full mt-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Sección 4.2 - Devolución del Manifiesto</h3>

            <div className="grid">
                <h4 className="font-medium mb-2">Representante EO-RS (entrega)</h4>
                <div className="border flex flex-wrap rounded-lg p-3">
                    <Input
                        label="Nombre"
                        value={formData.otrasObligaciones?.representanteEors || ""}
                        onChange={(e) => handleOtrasObligacionesChange('representanteEors', e.target.value.toUpperCase())}
                    />
                    <Input
                        label="Cargo"
                        value={formData.otrasObligaciones?.cargoRepresentanteEors || ""}
                        onChange={(e) => handleOtrasObligacionesChange('cargoRepresentanteEors', e.target.value.toUpperCase())}
                    />
                    <Input
                        label="DNI"
                        value={formData.otrasObligaciones?.dniRepresentanteEors || ""}
                        onChange={(e) => handleOtrasObligacionesChange('dniRepresentanteEors', e.target.value)}
                    />
                    <Input
                        label="Firma del representante EO-RS"
                        value={formData.otrasObligaciones?.firmaRepresentanteEors || ""}
                        onChange={(e) => handleOtrasObligacionesChange('firmaRepresentanteEors', e.target.value.toUpperCase())}
                        placeholder="Por el momento de forma manual"
                        ancho="w-full"
                        disabled
                    />
                </div>

                <h4 className="font-medium mb-2">Responsable Generador (recibe)</h4>
                <div className="border flex flex-wrap rounded-lg p-3">
                    <Input
                        label="Nombre"
                        value={formData.otrasObligaciones.generadorResponsableManejo || ""}
                        onChange={(e) => handleOtrasObligacionesChange('generadorResponsableManejo', e.target.value.toUpperCase())}
                    />
                    <Input
                        label="Cargo"
                        value={formData.otrasObligaciones.cargoGeneradorResponsableManejo || ""}
                        onChange={(e) => handleOtrasObligacionesChange('cargoGeneradorResponsableManejo', e.target.value.toUpperCase())}
                    />
                    <Input
                        label="DNI"
                        value={formData.otrasObligaciones.dniGeneradorResponsableManejo || ""}
                        onChange={(e) => handleOtrasObligacionesChange('dniGeneradorResponsableManejo', e.target.value)}
                    />
                    <Input
                        label="Firma del responsable generador"
                        value={formData.otrasObligaciones.firmaGeneradorResponsableManejo || ""}
                        onChange={(e) => handleOtrasObligacionesChange('firmaGeneradorResponsableManejo', e.target.value.toUpperCase())}
                        placeholder="Por el momento de forma manual"
                        ancho="w-full"
                        disabled
                    />
                    <Input
                        label="Fecha de devolución"
                        type="date"
                        value={formData.otrasObligaciones.fecha || ""}
                        onChange={(e) => handleOtrasObligacionesChange('fecha', e.target.value)}
                    />
                    <Input
                        label="Hora de devolución"
                        type="time"
                        value={formData.otrasObligaciones.hora || ""}
                        onChange={(e) => handleOtrasObligacionesChange('hora', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Paso6_OtrasObligaciones;