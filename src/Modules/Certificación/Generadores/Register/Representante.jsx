import Input from "../../../../recicle/Inputs/Inputs";

const Representante = ({ form, setForm }) => {
    return (
        <div className="flex flex-wrap">
            <Input
                label="Representante"
                name="representanteLegal"
                value={form.representanteLegal}
                setForm={setForm}
            />
            <Input
                label="DNI"
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                name="dniRepresentante"
                value={form.dniRepresentante}
                setForm={setForm}
            />

        </div>
    );
}

export default Representante;