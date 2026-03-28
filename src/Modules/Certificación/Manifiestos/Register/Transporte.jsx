import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Paso4_Transporte = ({ formData, setFormData }) => {
    const [formTransporte, setFormTransporte] = useState(formData.transporte || {
        nombreConductor: "",
        fechaRecepcion: "",
        tipoVehiculo: "",
        placaVehiculo: "",
        cantidadRecibida: "",
        observaciones: "",
    });
    const [formReferendo, setFormReferendo] = useState(formData.referendoEntrega || {
        referendo: false,
        generadorResponsableManejo: "",
        firmaGenerador: "",
        responsableEors: "",
        firmaResponsableEors: "",
        dniResponsableEors: "",
        cargoResponsableEors: "",
        fechaHora: "",
    });
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [conductoresOptions, setConductoresOptions] = useState([]);
    const [responsableGeneradorOptions, setResponsableGeneradorOptions] = useState([]);
    const [responsableEORSOptions, setResponsableEORSOptions] = useState([]);
    console.log("Opciones de conductores:", conductoresOptions);
    console.log("Opciones de responsables del generador:", responsableGeneradorOptions);
    console.log("Opciones de responsables EORS:", responsableEORSOptions);
    console.log("Opciones de transportistas:", transportistaOptions);
    const handleTransporteChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            transporte: {
                ...prev.transporte,
                [campo]: valor
            }
        }));
    };
    const handleReferendo = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            referendoEntrega: {
                ...prev.referendoEntrega,
                [campo]: valor
            }
        }));
    };
    useEffect(() => {
        if (formData.transportistaId) {
            const transportistaSeleccionado = formData?.transportistaId;
            const conductores = transportistaSeleccionado?.conductores || [];
            const allConductores = conductores?.map(c => c.nombre)
            setConductoresOptions(allConductores);
        }
    }, [formData.transportistaId]);

    useEffect(() => {
        if (formData.transportistaId) {
            const responsablesEORS = formData.transportistaId?.responsables
            console.log("Responsables EORS del transportista:", responsablesEORS);
            if (responsablesEORS.length > 0) {
                setResponsableEORSOptions(responsablesEORS.map(r => r.nombre));
            } else {
                setResponsableEORSOptions([]);
            }
        }

    }, [formData.transportistaId]);
    useEffect(() => {
        if (Object.keys(formData.generadorId || {}).length > 0) {
            console.log("Generador seleccionado para referendo:", formData.generadorId);
            const responsablesGenerador = formData.generadorId?.responsablesTecnicos
            console.log("Responsables Generador del transportista:", responsablesGenerador);
            if (responsablesGenerador.length > 0) {
                console.log("Nombres de responsables del generador:", responsablesGenerador.map(r => r.nombre));
                setResponsableGeneradorOptions(responsablesGenerador.map(r => r.nombreResponsable));
            } else {
                setResponsableGeneradorOptions([]);
            }
        }
    }, [formData.generadorId]);
    return (
        <div className="gap-4">
            <div className="flex flex-wrap">
                <Input
                    label="EO-RS Transportista *"
                    type="autocomplete"
                    name="transportistaId"
                    value={formData.transportistaId}
                    setForm={setFormData}
                    fetchData="/certificaciones/getTransportistasPaginacion"
                    setOptions={setTransportistaOptions}
                    options={transportistaOptions}
                    field="razonSocial"
                    placeholder="Buscar transportista por RUC o razón social"
                    disabled
                />

                <Input
                    label="Nombre del conductor *"
                    type="select"
                    value={formData.transporte?.nombreConductor || ""}
                    options={conductoresOptions}
                    onChange={(e) => handleTransporteChange('nombreConductor', e.target.value.toUpperCase())}
                    placeholder="Nombres y apellidos del conductor"
                />

                <Input
                    label="Tipo de vehículo *"
                    value={formData.transporte?.tipoVehiculo || ""}
                    onChange={(e) => handleTransporteChange('tipoVehiculo', e.target.value.toUpperCase())}
                    placeholder="Ej: CAMIÓN, CISTERNA"
                />

                <Input
                    label="Placa del vehículo *"
                    value={formData.transporte?.placaVehiculo || ""}
                    onChange={(e) => handleTransporteChange('placaVehiculo', e.target.value.toUpperCase())}
                    placeholder="Ej: ABC-123"
                />

                <Input
                    label="Fecha de recepción *"
                    type="date"
                    value={formData.transporte?.fechaRecepcion || ""}
                    onChange={(e) => handleTransporteChange('fechaRecepcion', e.target.value)}
                />

                <Input
                    label="Cantidad recibida (toneladas) *"
                    type="number"
                    step="0.01"
                    value={formData.transporte?.cantidadRecibida || ""}
                    onChange={(e) => handleTransporteChange('cantidadRecibida', e.target.value)}
                    placeholder="Ej: 15.5"
                />

                <Input
                    label="Observaciones"
                    value={formData.transporte?.observaciones || ""}
                    onChange={(e) => handleTransporteChange('observaciones', e.target.value)}
                    placeholder="Observaciones del transporte"
                    ancho="w-full"
                />

            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center mt-4 m-2">
                    <input
                        type="checkbox"
                        checked={formData.referendoEntrega?.referendo || false}
                        onChange={(e) => handleReferendo('referendo', e.target.checked)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-md text-gray-600">Referendo</span>
                </div>
                {formData.referendoEntrega?.referendo && (
                    <div className="flex flex-wrap">

                        <Input
                            label="Generador - Responsable del manejo"
                            type="select"
                            options={responsableGeneradorOptions}
                            value={formReferendo.generadorResponsableManejo}
                            setForm={setFormReferendo}
                            placeholder="Nombre del generador - responsable del manejo"
                            ancho="w-full"
                        />
                        <Input
                            label="Firma del generador"
                            value={formData.referendoEntrega?.firmaGenerador || ""}
                            onChange={(e) => handleReferendo('firmaGenerador', e.target.value.toUpperCase())}
                            placeholder="Por el momento de forma manual"
                            ancho="w-full"
                            disabled
                        />
                        <Input
                            label="Responsable EORS"
                            type="select"
                            options={responsableEORSOptions}
                            value={formReferendo.responsableEors}
                            setForm={setFormReferendo}
                            placeholder="Nombre del responsable EORS"
                            ancho="w-full"
                        />
                        <Input
                            label="Firma del responsable EORS"
                            value={formData.referendoEntrega?.firmaResponsableEors || ""}
                            onChange={(e) => handleReferendo('firmaResponsableEors', e.target.value.toUpperCase())}
                            placeholder="Por el momento de forma manual"
                            ancho="w-full"
                            disabled
                        />
                        <Input
                            label="DNI del responsable EORS"
                            value={formData.referendoEntrega?.dniResponsableEors || ""}
                            onChange={(e) => handleReferendo('dniResponsableEors', e.target.value)}
                            placeholder="DNI del responsable EORS"
                            ancho="w-full"
                        />
                        <Input
                            label="Cargo del responsable EORS"
                            value={formData.referendoEntrega?.cargoResponsableEors || ""}
                            onChange={(e) => handleReferendo('cargoResponsableEors', e.target.value.toUpperCase())}
                            placeholder="Cargo del responsable EORS"
                            ancho="w-full"
                        />
                        <Input
                            label="Fecha y hora del referendo"
                            type="date"
                            value={formData.referendoEntrega?.fechaHora || ""}
                            onChange={(e) => handleReferendo('fechaHora', e.target.value)}
                            ancho="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Paso4_Transporte;