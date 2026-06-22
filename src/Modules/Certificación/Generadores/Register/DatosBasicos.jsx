import { Checkbox } from "primereact/checkbox";
import Input from "../../../../recicle/Inputs/Inputs";
import InpuFiles from "../../../../recicle/Inputs/tipos/InputFile";

const DatosBasicos = ({ form, setForm }) => {
    return (
        <div className="flex flex-wrap">
            <Input
                label="Razón Social"
                value={form.razonSocial}
                name="razonSocial"
                setForm={setForm}
            />
            <Input
                label="RUC"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={form.ruc}
                name="ruc"
                ancho=" !min-w-32 w-44"
                maxLength={11}
                setForm={setForm}
            />
            <Input
                label="Teléfono"
                value={form.telefono}
                name="telefono"
                ancho=" !min-w-32 w-44"
                setForm={setForm}
            />
            <Input
                label="Correo"
                value={form.correoElectronico}
                name="correoElectronico"
                setForm={setForm}
            />
            <Input
                label="Representante Legal"
                name="representanteLegal"
                value={form.representanteLegal}
                setForm={setForm}
            />
            <Input
                label="DNI del Representante"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                ancho=" !min-w-32 w-44"
                name="dniRepresentante"
                value={form.dniRepresentante}
                setForm={setForm}
            />
            <Input
                label="Usuario en Manifestower"
                type="switch"
                name="usuarioManifestower"
                switchLabel="Activar usuario"
                value={form.usuarioManifestower}
                setForm={setForm}
            />
        </div>
    );
};

export default DatosBasicos;