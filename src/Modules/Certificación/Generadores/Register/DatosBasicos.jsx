import Input from "../../../../recicle/Inputs/Inputs";

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
                maxLength={11}
                setForm={setForm}
            />
            <Input
                label="Teléfono"
                value={form.telefono}
                name="telefono"
                setForm={setForm}
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
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
                name="dniRepresentante"
                value={form.dniRepresentante}
                setForm={setForm}
            />
            <Input
                label="Firma del Representante"
                name="firmaRepresentante"
                type="file"
                value={form.firmaRepresentante}
                setForm={setForm}
            />

        </div>
    );
};

export default DatosBasicos;