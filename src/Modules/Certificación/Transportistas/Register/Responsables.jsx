import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import InputFiles from "../../../../recicle/Inputs/tipos/InputFile";

const Responsables = ({ set, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        dni: initialData?.dni || "",
        cargo: initialData?.cargo || "",
        firmaResponsable: initialData?.firmaResponsable || "",
    });
    useEffect(() => {
        set({
            nombre: formData.nombre,
            dni: formData.dni,
            cargo: formData.cargo,
            firmaResponsable: formData.firmaResponsable,
        })
    }, [formData]);
    return (
        <div className="flex flex-wrap px-1">
            <Input
                ancho="!w-96"
                label="Nombre del Responsable"
                name="nombre"
                value={formData.nombre || ""}
                setForm={setFormData}
                placeholder="Nombres y apellidos"
            />
            <Input
                label="Cargo del Responsable"
                name="cargo"
                value={formData.cargo || ""}
                setForm={setFormData}
                placeholder="Ej: Gerente General"
            />
            <Input
                label="DNI del Responsable"
                name="dni"
                value={formData.dni || ""}
                setForm={setFormData}
                ancho="!min-w-32 w-44"
                placeholder="Ej: 12345678"
            />
            <InputFiles
                label="Firma del Responsable"
                name="firmaResponsable"
                value={formData.firmaResponsable}
                setForm={setFormData}
                toBase64
            />

        </div>

    );
};

export default Responsables;