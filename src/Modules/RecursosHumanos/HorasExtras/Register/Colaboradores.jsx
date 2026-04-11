import { useEffect, useState } from "react"
import Input from "../../../../recicle/Inputs/Inputs"
import InputNormal from "../../../../recicle/Inputs/tipos/Normal"

const Colaboradores = ({ set, initialData }) => {
    const [colaboradorOptions, setColaboradorOptions] = useState([])
    const [formData, setFormData] = useState({
        colaborador: initialData?.colaborador || "",
        horas: initialData?.horas || 0,
        minutos: initialData?.minutos || 0,
        minutosTotales: initialData?.minutosTotales || 0
    })

    const handleHorasChange = (e) => {
        const horas = parseInt(e.target.value) || 0;
        // Validar que horas no exceda 24
        const horasValidas = Math.min(Math.max(horas, 0), 24);

        setFormData((prev) => {
            const nuevosDatos = {
                ...prev,
                horas: horasValidas,
                minutos: prev.minutos,
                minutosTotales: (horasValidas * 60) + prev.minutos
            };
            return nuevosDatos;
        });
    }

    const handleMinutosChange = (e) => {
        let minutos = parseInt(e.target.value) || 0;
        // Limitar minutos a 59 y no negativos
        minutos = Math.min(Math.max(minutos, 0), 59);

        setFormData((prev) => {
            const nuevosDatos = {
                ...prev,
                minutos: minutos,
                minutosTotales: (prev.horas * 60) + minutos
            };
            return nuevosDatos;
        });
    }
    useEffect(() => {
        set({
            colaborador: formData.colaborador,
            horas: formData.horas,
            minutos: formData.minutos,
            minutosTotales: formData.minutosTotales
        });
    }, [formData])
    return (
        <div className="flex flex-wrap">
            <Input
                label="Colaborador"
                name="colaborador"
                type="autocomplete"
                value={formData.colaborador}
                setForm={setFormData}
                ancho="!min-w-96"
                fetchData={"/getEmployeeByParams"}
                setOptions={setColaboradorOptions}
                field={(item) => `${item.name} ${item.lastname}`}
                options={colaboradorOptions}
                required
            />
            <InputNormal
                label="Horas"
                name="horas"
                type="number"
                min="0"
                max="24"
                step="1"
                ancho="!min-w-36"
                value={formData.horas}
                onChange={handleHorasChange}
            />
            <InputNormal
                label="Minutos"
                name="minutos"
                type="number"
                min="0"
                max="59"
                step="1"
                ancho="!min-w-36"
                value={formData.minutos}
                onChange={handleMinutosChange}
            />
            {/* Mostrar total en minutos */}
            <InputNormal
                label="Minutos Totales"
                name="minutosTotales"
                type="number"
                ancho="!min-w-32 !w-36"
                value={formData.minutosTotales}
                disabled
                readOnly
            />
        </div >
    )
}

export default Colaboradores