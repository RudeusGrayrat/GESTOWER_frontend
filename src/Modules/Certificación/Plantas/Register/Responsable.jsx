import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Responsable = ({ form, setForm }) => {
    const [responsable, setResponsable] = useState({
        nombre: form.responsableGestion.nombre || "",
        cargo: form.responsableGestion.cargo || "",
        dni: form.responsableGestion.dni || "",
        correo: form.responsableGestion.correo || "",
        telefono: form.responsableGestion.telefono || ""
    });

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            responsableGestion: responsable
        }));
    }, [responsable, setForm]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="Nombre del responsable *"
                name="nombre"
                value={responsable.nombre}
                setForm={setResponsable}
                ancho="w-96"
            />
            <Input
                label="Cargo del responsable *"
                name="cargo"
                value={responsable.cargo}
                setForm={setResponsable}
            />
            <Input
                label="DNI del responsable *"
                name="dni"
                value={responsable.dni}
                setForm={setResponsable}
            />
            <Input
                label="Correo del responsable *"
                name="correo"
                value={responsable.correo}
                setForm={setResponsable}
            />
            <Input
                label="Teléfono del responsable"
                name="telefono"
                value={responsable.telefono}
                setForm={setResponsable}
            />
        </div >
    );
};

export default Responsable;