import { useState, useEffect } from "react";
import Input from "../../../../recicle/Inputs/Inputs";

const Contingencias = ({ formData, setFormData }) => {
    const [ubigeoOptions, setUbigeoOptions] = useState([]);

    return (
        <div className="flex flex-wrap">
            <Input
                label="Derrame"
                name="derrame"
                value={formData.derrame}
                setForm={setFormData}
            />

            <Input
                label="Infiltración"
                name="infiltracion"
                value={formData.infiltracion}
                setForm={setFormData}
            />

            <Input
                label="Incendio"
                name="incendio"
                value={formData.incendio}
                setForm={setFormData}
            />

            <Input
                label="Explosión"
                name="explosion"
                value={formData.explosion}
                setForm={setFormData}
            />
            <Input
                label="Otros Accidentes"
                name="otros"
                value={formData.otros}
                setForm={setFormData}
            />
        </div>
    );
};

export default Contingencias;