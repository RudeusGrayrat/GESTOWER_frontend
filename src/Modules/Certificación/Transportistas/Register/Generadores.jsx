import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const GeneradoresTransportistas = ({ set, initialData }) => {
    const [generadorOptions, setGeneradorOptions] = useState();

    // 🌟 Extraemos de manera segura el objeto del generador ya sea que venga poblado de la API o limpio
    const [formData, setFormData] = useState({
        generadorObjeto: initialData?.generadorId || "",
        tienePermisoLlenado: initialData?.tienePermisoLlenado || false
    });

    // Sincronizamos cambios si cambian externamente (importante para edición dinámica)
    useEffect(() => {
        if (initialData?.generadorId) {
            setFormData({
                generadorObjeto: initialData.generadorId,
                tienePermisoLlenado: initialData.tienePermisoLlenado || false
            });
        }
    }, [initialData]);

    // 🌟 Notificamos al Directorio padre con la estructura de datos real requerida
    useEffect(() => {
        if (formData.generadorObjeto) {
            set({
                generadorId: formData.generadorObjeto, // Objeto completo (mantiene consistencia en el Front)
                tienePermisoLlenado: formData.tienePermisoLlenado
            });
        }
    }, [formData.generadorObjeto, formData.tienePermisoLlenado]);

    return (
        <div className="w-full h-full flex flex-wrap px-1">
            <Input
                label="Razon Social"
                name="generadorObjeto" // 🌟 Apunta al objeto del estado local
                ancho="!w-96"
                value={formData.generadorObjeto}
                fetchData="/certificaciones/getGeneradoresPaginacion"
                setOptions={setGeneradorOptions}
                options={generadorOptions}
                type="autocomplete"
                field="razonSocial"
                setForm={setFormData}
            />
            <Input
                label="RUC"
                name="ruc"
                ancho=" min-w-12 w-36"
                value={formData.generadorObjeto?.ruc || ""}
                disabled
            />
            <Input
                label="Correo Electrónico"
                name="correoElectronico"
                value={formData.generadorObjeto?.correoElectronico || ""}
                disabled
            />
            <Input
                label="Teléfono"
                name="telefono"
                ancho=" min-w-12 w-32"
                value={formData.generadorObjeto?.telefono || ""}
                disabled
            />
            <Input
                label="Representante Legal"
                name="representanteLegal"
                value={formData.generadorObjeto?.representanteLegal || ""}
                disabled
            />
            <Input
                label="DNI Representante"
                name="dniRepresentante"
                ancho=" min-w-12 w-36"
                value={formData.generadorObjeto?.dniRepresentante || ""}
                disabled
            />
        </div>
    );
};

export default GeneradoresTransportistas;