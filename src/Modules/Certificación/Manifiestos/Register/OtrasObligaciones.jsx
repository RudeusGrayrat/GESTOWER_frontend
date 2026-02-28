import Input from "../../../../recicle/Inputs/Inputs";

const Paso4_OtrasObligaciones = ({ formData, setFormData }) => {
    return (
        <div className="flex flex-wrap">
            <Input
                label="Otras obligaciones del generador"
                value={formData.otrasObligaciones || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, otrasObligaciones: e.target.value }))}
                placeholder="Describa otras obligaciones del generador"
                ancho="w-full"
            />
        </div>
    );
}

export default Paso4_OtrasObligaciones;