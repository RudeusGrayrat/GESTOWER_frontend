import Input from "../../../../recicle/Inputs/Inputs";

const Paso2_Residuo = ({ formData, setFormData }) => {
    const estadosFisicos = [
        { value: "SOLIDO", label: "Sólido" },
        { value: "SEMISOLIDO", label: "Semisólido" },
        { value: "LIQUIDO", label: "Líquido" },
        { value: "GAS", label: "Gas" }
    ];

    const codigosBasilea = [
        { value: "A1", label: "A1 - Residuos metálicos o que contengan metales" },
        { value: "A2", label: "A2 - Residuos con constituyentes inorgánicos" },
        { value: "A3", label: "A3 - Residuos con constituyentes orgánicos" },
        { value: "A4", label: "A4 - Residuos con constituyentes mixtos" }
    ];

    const handleResiduoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            residuo: {
                ...prev.residuo,
                [campo]: valor
            }
        }));
    };

    const handleRecipienteChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            residuo: {
                ...prev.residuo,
                recipiente: {
                    ...prev.residuo.recipiente,
                    [campo]: valor
                }
            }
        }));
    };

    return (
        <div className="flex flex-wrap">
            <Input
                label="Descripción del residuo *"
                value={formData.residuo?.descripcion || ""}
                onChange={(e) => handleResiduoChange('descripcion', e.target.value.toUpperCase())}
                placeholder="Describa el residuo peligroso"
                ancho="w-full"
            />

            <Input
                label="Cantidad total (toneladas) *"
                type="number"
                step="0.01"
                value={formData.residuo?.cantidadTotal || ""}
                onChange={(e) => handleResiduoChange('cantidadTotal', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <Input
                label="Estado del residuo *"
                type="select"
                value={formData.residuo?.estadoFisico || "SOLIDO"}
                onChange={(e) => handleResiduoChange('estadoFisico', e.target.value)}
                options={estadosFisicos}
                optionLabel="label"
                optionValue="value"
            />

            <div className="w-full mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Características del recipiente</h3>
                <div className="flex flex-wrap">
                    <Input
                        label="Tipo de recipiente"
                        value={formData.residuo?.recipiente?.tipo || ""}
                        onChange={(e) => handleRecipienteChange('tipo', e.target.value.toUpperCase())}
                        placeholder="Ej: CILINDRO, SACO, TANQUE"
                    />

                    <Input
                        label="Material"
                        value={formData.residuo?.recipiente?.material || ""}
                        onChange={(e) => handleRecipienteChange('material', e.target.value.toUpperCase())}
                        placeholder="Ej: METAL, PLÁSTICO"
                    />

                    <Input
                        label="N° de recipientes"
                        type="number"
                        value={formData.residuo?.recipiente?.numero || 1}
                        onChange={(e) => handleRecipienteChange('numero', parseInt(e.target.value) || 1)}
                        min="1"
                    />
                </div>
            </div>

            <div className="w-full mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Clasificación Convenio Basilea</h3>
                <div className="flex flex-wrap">
                    <Input
                        label="Código de clasificación"
                        type="select"
                        value={formData.residuo?.codigoBasilea || ""}
                        onChange={(e) => handleResiduoChange('codigoBasilea', e.target.value)}
                        options={codigosBasilea}
                        optionLabel="label"
                        optionValue="value"
                    />

                    <Input
                        label="Subcódigo (A-...)"
                        value={formData.residuo?.subcodigoBasilea || ""}
                        onChange={(e) => handleResiduoChange('subcodigoBasilea', e.target.value.toUpperCase())}
                        placeholder="Ej: A1010"
                    />

                    <Input
                        label="Información adicional"
                        value={formData.residuo?.informacionAdicional || ""}
                        onChange={(e) => handleResiduoChange('informacionAdicional', e.target.value)}
                        placeholder="Información complementaria"
                        ancho="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default Paso2_Residuo;