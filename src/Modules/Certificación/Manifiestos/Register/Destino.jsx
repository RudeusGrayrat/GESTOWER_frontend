import { useState, useEffect } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Paso5_Destino = ({ formData, setFormData }) => {
    const [destinoOptions, setDestinoOptions] = useState([]);
    const tipoManejoOptions = ["TRATAMIENTO", "DISPOSICIÓN FINAL", "VALORIZACIÓN"];

    const handleDestinoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            destinoFinal: {
                ...prev.destinoFinal,
                [campo]: valor
            }
        }));
    };


    const handleReferendo = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            referendoRecepcion: {
                ...prev.referendoRecepcion,
                [campo]: valor
            }
        }));
    }
    const handleOtrosManejosChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            otrosManejos: {
                ...prev.otrosManejos,
                [campo]: valor
            }
        }));
    };

    const clearOtrosManejosFields = () => ({
        razonSocialReceptor: "",
        rucReceptor: "",
        correoReceptor: "",
        telefonoReceptor: "",
        tipoManejo: "",
        direccionDestino: "",
        documentoAprueba: ""
    });

    // Función para llenar los campos desde transportistaId
    const fillFromTransportista = (transportista) => ({
        razonSocialReceptor: transportista?.razonSocial || "",
        rucReceptor: transportista?.ruc || "",
        correoReceptor: transportista?.correoElectronico || "",
        telefonoReceptor: transportista?.telefono || "",
        direccionDestino: transportista?.direccion || "",
        documentoAprueba: transportista?.registroEors || "",
        // Estos campos no se llenan automáticamente
        tipoManejo: ""
    });

    const handleCheckboxChange = (nombre) => {
        setFormData(prev => {
            const otros = prev.otrosManejos || {};
            const transportista = prev.transportistaId;

            // Si el checkbox clickeado ya estaba activo, lo desactivamos y limpiamos campos
            if (otros[nombre]) {
                return {
                    ...prev,
                    otrosManejos: {
                        ...clearOtrosManejosFields(),
                        comercializacion: false,
                        exportacion: false,
                        otro: false
                    }
                };
            }

            // Si no estaba activo, lo activamos y desactivamos los otros
            const nuevosValores = {
                comercializacion: false,
                exportacion: false,
                otro: false,
                [nombre]: true
            };

            // Según cuál se activó, llenamos o limpiamos campos
            let camposAdicionales = {};
            if (nombre === "comercializacion") {
                camposAdicionales = fillFromTransportista(transportista);
            } else {
                // exportacion u otro: limpiamos campos
                camposAdicionales = clearOtrosManejosFields();
            }

            return {
                ...prev,
                otrosManejos: {
                    ...prev.otrosManejos,
                    ...nuevosValores,
                    ...camposAdicionales
                }
            };
        });
    };

    // Efecto para actualizar campos si transportistaId cambia mientras comercializacion está activo
    useEffect(() => {
        if (formData.otrosManejos?.comercializacion) {
            setFormData(prev => ({
                ...prev,
                otrosManejos: {
                    ...prev.otrosManejos,
                    ...fillFromTransportista(prev.transportistaId)
                }
            }));
        }
    }, [formData.transportistaId]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="EO-RS Destino Final *"
                type="autocomplete"
                name="destinoId"
                value={formData.destinoId}
                setForm={setFormData}
                fetchData="/certificaciones/getDestinosPaginacion"
                setOptions={setDestinoOptions}
                options={destinoOptions}
                field="razonSocial"
                placeholder="Buscar destino por RUC o razón social"
            />

            <Input
                label="Tipo de Manejo *"
                type="select"
                name="tipoManejo"
                value={formData.destinoFinal?.tipoManejo || ""}
                onChange={(e) => handleDestinoChange('tipoManejo', e.target.value)}
                options={tipoManejoOptions}
                placeholder="Seleccionar tipo de manejo"
            />

            <Input
                label="Cantidad entregada (toneladas) *"
                type="number"
                step="0.01"
                value={formData.destinoFinal?.cantidadEntregada || ""}
                onChange={(e) => handleDestinoChange('cantidadEntregada', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <Input
                label="Observaciones"
                value={formData.destinoFinal?.observaciones || ""}
                onChange={(e) => handleDestinoChange('observaciones', e.target.value)}
                placeholder="Observaciones del destino final"
                ancho="w-full"
            />

            <div className="w-full mt-4 border-t pt-4">
                <div className="flex flex-col gap-4 ">
                    <div className="flex items-center mt-4 m-2">
                        <input
                            type="checkbox"
                            checked={formData.referendoRecepcion?.referendo || false}
                            onChange={(e) => handleReferendo('referendo', e.target.checked)}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-md text-gray-600">Referendo</span>
                    </div>
                    {formData.referendoRecepcion?.referendo && (
                        <div className="flex flex-wrap">

                            <Input
                                label="Responsable EO-RS del destino final"
                                value={formData.referendoRecepcion?.responsableEorsDestino || ""}
                                onChange={(e) => handleReferendo('responsableEorsDestino', e.target.value.toUpperCase())}
                                placeholder="Nombre del responsable EO-RS del destino final"
                                ancho="w-full"
                            />
                            <Input
                                label="Firma del generador"
                                value={formData.referendoRecepcion?.firmaGenerador || ""}
                                onChange={(e) => handleReferendo('firmaGenerador', e.target.value.toUpperCase())}
                                placeholder="Por el momento de forma manual"
                                ancho="w-full"
                                disabled
                            />
                            <Input
                                label="DNI"
                                value={formData.referendoRecepcion?.dniResponsableEorsDestino || ""}
                                onChange={(e) => handleReferendo('dniResponsableEorsDestino', e.target.value)}
                                placeholder="DNI del responsable EO-RS del destino final"
                            />
                            <Input
                                label="Cargo"
                                value={formData.referendoRecepcion?.cargoResponsableEorsDestino || ""}
                                onChange={(e) => handleReferendo('cargoResponsableEorsDestino', e.target.value.toUpperCase())}
                                placeholder="Cargo del responsable EO-RS del destino final"
                            />
                            <Input
                                label="Fecha y hora"
                                type="datetime-local"
                                value={formData.referendoRecepcion?.fechaHora || ""}
                                onChange={(e) => handleReferendo('fechaHora', e.target.value)}
                                placeholder="Fecha y hora del referendo"
                            />
                        </div>
                    )}
                </div>
                <div className="w-full mt-4 border-t pt-4 ">
                    <span className="text-lg font-semibold">Otros Manejos</span>
                    <div className="flex gap-8 mt-3">
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.comercializacion || false}
                                onChange={(e) => handleCheckboxChange('comercializacion', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Comercialización</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.exportacion || false}
                                onChange={(e) => handleCheckboxChange('exportacion', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Exportación</span>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={formData.otrosManejos?.otro || false}
                                onChange={(e) => handleCheckboxChange('otro', e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Otro</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4  bg-gray-50 rounded-lg">
                    <Input
                        label="Razón Social del Receptor"
                        onChange={(e) => handleOtrosManejosChange('razonSocialReceptor', e.target.value.toUpperCase())}
                        placeholder="Razón social del receptor"
                        value={formData.otrosManejos?.razonSocialReceptor || ""}
                    />

                    <Input
                        label="RUC del Receptor"
                        value={formData.otrosManejos?.rucReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('rucReceptor', e.target.value)}
                        placeholder="RUC"
                    />

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        value={formData.otrosManejos?.correoReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('correoReceptor', e.target.value.toLowerCase())}
                        placeholder="correo@ejemplo.com"
                    />

                    <Input
                        label="Teléfono"
                        value={formData.otrosManejos?.telefonoReceptor || ""}
                        onChange={(e) => handleOtrosManejosChange('telefonoReceptor', e.target.value)}
                        placeholder="Teléfono"
                    />


                    <Input
                        label="Tipo de Manejo Realizado"
                        value={formData.otrosManejos?.tipoManejo || ""}
                        onChange={(e) => handleOtrosManejosChange('tipoManejo', e.target.value.toUpperCase())}
                        placeholder="Especifique el tipo de manejo"
                        ancho="w-full"
                    />

                    <Input
                        label="Dirección de Destino / País"
                        value={formData.otrosManejos?.direccionDestino || ""}
                        onChange={(e) => handleOtrosManejosChange('direccionDestino', e.target.value.toUpperCase())}
                        placeholder="Dirección o país de destino"
                        ancho="w-full"
                    />

                    <Input
                        label="Documento que Aprueba"
                        value={formData.otrosManejos?.documentoAprueba || ""}
                        onChange={(e) => handleOtrosManejosChange('documentoAprueba', e.target.value.toUpperCase())}
                        placeholder="N° de resolución o documento"
                        ancho="w-full"
                    />
                </div>
            </div>
        </div >
    );
};

export default Paso5_Destino;