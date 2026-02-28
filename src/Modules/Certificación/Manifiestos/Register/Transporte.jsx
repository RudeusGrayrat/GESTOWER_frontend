import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";

const Paso4_Transporte = ({ formData, setFormData }) => {
    const [transportistaOptions, setTransportistaOptions] = useState([]);

    const handleTransporteChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            transporte: {
                ...prev.transporte,
                [campo]: valor
            }
        }));
    };

    // Precargar TOWER si es SERVICIO TOWER
    useEffect(() => {
        const cargarTowerTransportista = async () => {
            if (formData.servicioTransporte === "SERVICIO TOWER") {
                try {
                    const response = await axios.get("/certificaciones/getTransportistasPaginacion", {
                        params: { search: "TOWER" }
                    });
                    const towerTransportista = response.data?.data?.find(t => t.razonSocial?.includes("TOWER"));
                    if (towerTransportista) {
                        setFormData(prev => ({
                            ...prev,
                            transportistaId: towerTransportista
                        }));
                    }
                } catch (error) {
                    console.error("Error cargando transportista TOWER:", error);
                }
            }
        };
        cargarTowerTransportista();
    }, [formData.servicioTransporte, setFormData]);

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
                value={formData.transporte?.nombreConductor || ""}
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