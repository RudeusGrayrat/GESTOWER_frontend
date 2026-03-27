import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Responsable_y_Representante = ({ set, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        dni: initialData?.dni || "",
        cargo: initialData?.cargo || "",
        numeroColegiatura: initialData?.numeroColegiatura || "",
    });
    useEffect(() => {
        console.log("FormData actualizado:", formData);
        set({
            nombre: formData.nombre,
            dni: formData.dni,
            cargo: formData.cargo,
            numeroColegiatura: formData.numeroColegiatura,
        })
    }, [formData]);
    return (
        <div className="flex flex-wrap">
            <Input
                ancho="!w-96"
                label="Nombre del Responsable"
                name="nombre"
                value={formData.nombre || ""}
                setForm={setFormData}
                placeholder="Nombres y apellidos"
            />
            <Input
                label="DNI del Responsable"
                name="dni"
                value={formData.dni || ""}
                setForm={setFormData}
                placeholder="Ej: 12345678"
            />
            <Input
                label="Cargo del Responsable"
                name="cargo"
                value={formData.cargo || ""}
                setForm={setFormData}
                placeholder="Ej: Gerente General"
            />
            <Input
                label="N° de Colegiatura"
                name="numeroColegiatura"
                value={formData.numeroColegiatura || ""}
                setForm={setFormData}
                placeholder="Ej: CIP 123456"
            />

        </div>

    );
};

export default Responsable_y_Representante;