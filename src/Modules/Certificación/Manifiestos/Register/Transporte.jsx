import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Paso4_Transporte = ({ formData, setFormData }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);
    const [conductoresOptions, setConductoresOptions] = useState([]);
    useEffect(() => {
        if (formData.transportistaId) {
            const transportistaSeleccionado = formData?.transportistaId;
            const conductores = transportistaSeleccionado?.conductores || [];
            const allConductores = conductores?.map(c => c.nombre)
            setConductoresOptions(allConductores);
        }
    }, [formData.transportistaId]);
    const handleTransporteChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            transporte: {
                ...prev.transporte,
                [campo]: valor
            }
        }));
    };

    return (
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
    );
};

export default Paso4_Transporte;