import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import InpuFiles from "../../../../recicle/Inputs/tipos/InputFile";

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
                ancho={"!min-w-32 w-40"}
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
                label="Correo del Responsable"
                type="email"
                name="correoResponsable"
                value={form.correoResponsable}
                setForm={setForm}
                placeholder="Ej: juan.perez@empresa.com"
            />
            <Input
                label="Teléfono del Responsable"
                type="text"
                ancho={"!min-w-32 w-44"}
                name="telefonoResponsable"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={form.telefonoResponsable}
                setForm={setForm}
                placeholder="Ej: 987654321"
            />
            <InpuFiles
                label="Firma del Responsable"
                name="firmaResponsable"
                value={form.firmaResponsable}
                setForm={setForm}
                toBase64
            />
        </div>
    )
};

export default Responsable;