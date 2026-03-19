import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Responsable = ({ set, initialData }) => {
    const [form, setForm] = useState({
        nombreResponsable: initialData?.nombreResponsable || "",
        dniResponsable: initialData?.dniResponsable || "",
        cargoResponsable: initialData?.cargoResponsable || "",
        firmaResponsable: initialData?.firmaResponsable || null,
    });

    useEffect(() => {
        set({
            nombreResponsable: form.nombreResponsable,
            dniResponsable: form.dniResponsable,
            cargoResponsable: form.cargoResponsable,
            firmaResponsable: form.firmaResponsable,
        })
    }, [form]);
    return (
        <div className="w-full flex flex-wrap">
            <Input
                label="Nombre del Responsable"
                type="text"
                name="nombreResponsable"
                value={form.nombreResponsable}
                setForm={setForm}
                placeholder="Ej: Juan Pérez"
            />
            <Input
                label="DNI del Responsable"
                type="text"
                name="dniResponsable"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={form.dniResponsable}
                setForm={setForm}
                placeholder="Ej: 12345678"
            />
            <Input
                label="Cargo del Responsable"
                type="text"
                name="cargoResponsable"
                value={form.cargoResponsable}
                setForm={setForm}
                placeholder="Ej: Gerente General"
            />
            <Input
                label="Firma del Responsable"
                name="firmaResponsable"
                type="file"
                value={form.firmaResponsable}
                setForm={setForm}
            />
        </div>
    )
};

export default Responsable;