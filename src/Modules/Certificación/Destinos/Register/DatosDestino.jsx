import { useState, useEffect } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";

const DatosDestino = ({ formData, setFormData }) => {
    const [ubigeoOptions, setUbigeoOptions] = useState([]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="Razón Social"
                name="razonSocial"
                value={formData.razonSocial}
                setForm={setFormData}
                placeholder="Ej: EMPRESA DE TRATAMIENTO S.A.C."
            />

            <Input
                label="RUC"
                name="ruc"
                value={formData.ruc}
                setForm={setFormData}
                maxLength={11}
                placeholder="Ej: 20123456789"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />

            <Input
                label="Código Registro EO-RS"
                name="codigoRegistroEors"
                value={formData.codigoRegistroEors}
                setForm={setFormData}
                placeholder="Ej: EO-RS-D-2024-001"
            />

            <Input
                label="Autorización Municipal"
                name="autorizacionMunicipal"
                value={formData.autorizacionMunicipal}
                setForm={setFormData}
                placeholder="N° de autorización municipal"
            />

            <Input
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                setForm={setFormData}
                placeholder="Dirección completa"
            />
            <Input
                label="Ubigeo"
                type="autocomplete"
                optionValue="_id"
                name="ubigeoId"
                value={formData.ubigeoId}
                setForm={setFormData}
                fetchData="/certificaciones/getUbigeoPaginacion"
                setOptions={setUbigeoOptions}
                field="distrito"
                options={ubigeoOptions}
                placeholder="Buscar distrito..."
            />

            <Input
                label="Correo Electrónico"
                name="correoElectronico"
                type="email"
                value={formData.correoElectronico}
                setForm={setFormData}
                placeholder="correo@empresa.com"
            />

            <Input
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                setForm={setFormData}
                maxLength={9}
                placeholder="Ej: 987654321"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
        </div>
    );
};

export default DatosDestino;