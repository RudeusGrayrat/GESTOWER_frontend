import { useEffect, useState } from "react"
import Input from "../../../../recicle/Inputs/Inputs"
import InputNormal from "../../../../recicle/Inputs/tipos/Normal"
import InputTime from "../../../../recicle/Inputs/tipos/InputTime"
import dayjs from "dayjs"

const Colaboradores = ({ set, initialData }) => {
    const [colaboradorOptions, setColaboradorOptions] = useState([])
    const [formData, setFormData] = useState({
        colaborador: initialData?.colaborador || "",
        horaInicio: initialData?.horaInicio || "06:00 PM",
        horaFin: initialData?.horaFin || "06:01 PM",
        horas: initialData?.horas || "",
        minutos: initialData?.minutos || "",
        minutosTotales: initialData?.minutosTotales || 0
    })

    // Función para calcular minutos totales entre horaInicio y horaFin
    const calcularMinutosTotales = (inicio, fin) => {
        if (!inicio || !fin) return 0;
        const ini = dayjs(inicio, "hh:mm A");
        const end = dayjs(fin, "hh:mm A");
        let diff = end.diff(ini, "minute");
        if (diff <= 0) diff += 24 * 60;
        return diff;
    }

    // Formatear minutos totales a horas y minutos para mostrar
    const formatearMinutos = (minutos) => {
        if (!minutos && minutos !== 0) return "0h 0m";
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas}h ${mins}m`;
    }

    useEffect(() => {
        set({
            colaborador: formData.colaborador,
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            minutosTotales: formData.minutosTotales,
            horas: formData.horas,
            minutos: formData.minutos
        });
    }, [formData])

    return (
        <div className="flex flex-wrap gap-2">
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

            <InputTime
                label="Hora Inicio"
                name="horaInicio"

                ancho="!w-40 !min-w-36"
                value={formData.horaInicio}
                setForm={(updater) => {
                    setFormData((prev) => {
                        const updated = typeof updater === "function" ? updater(prev) : updater;
                        const minutosTotales = calcularMinutosTotales(updated.horaInicio, prev.horaFin);
                        const horas = Math.floor(minutosTotales / 60);
                        const minutos = minutosTotales % 60;
                        return { ...updated, minutosTotales, horas, minutos };
                    });
                }}
            />

            <InputTime
                label="Hora Fin"
                name="horaFin"
                ancho="!w-40 !min-w-36"
                value={formData.horaFin}
                setForm={(updater) => {
                    setFormData((prev) => {
                        const updated = typeof updater === "function" ? updater(prev) : updater;
                        const minutosTotales = calcularMinutosTotales(prev.horaInicio, updated.horaFin);
                        const horas = Math.floor(minutosTotales / 60);
                        const minutos = minutosTotales % 60;
                        return { ...updated, minutosTotales, horas, minutos };
                    });
                }}
            />
            <InputNormal
                label="Duración Total"
                name="duracionTotal"
                type="text"
                ancho="!min-w-32 !w-40"
                value={formatearMinutos(formData.minutosTotales)}
                disabled
                readOnly
            />

        </div>
    )
}

export default Colaboradores