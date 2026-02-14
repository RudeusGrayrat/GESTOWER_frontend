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
                setForm={setForm}
            />
            <Input
                label="Dirección"
                value={form.direccion}
                name="direccion"
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

        </div>
    );
};

export default DatosBasicos;