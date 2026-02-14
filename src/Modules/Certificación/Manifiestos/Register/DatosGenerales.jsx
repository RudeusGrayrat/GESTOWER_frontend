import Input from "../../../../recicle/Inputs/Inputs";

const DatosGenerales = ({ form, setForm }) => {
    return (
        <div className=" flex flex-wrap">
            <Input
                label="Fecha"
                name="fecha"
                type="month"
                value={form.fecha}
                setForm={setForm}
            />
            <Input
                label="Generador"
                name="generador"
                type="select"
                value={form.generador}
                setForm={setForm}
            />
            <Input
                label="Denominacion de planta"
                name="denominacionPlanta"
                type="text"
                value={form.denominacionPlanta}
                setForm={setForm}
            />
            <Input
                label="Tipo de Planta"
                name="tipoPlanta"
                type="select"
                value={form.tipoPlanta}
                setForm={setForm}
            />
            <Input
                label="Direccion de planta"
                name="direccionPlanta"
                type="text"
                value={form.direccionPlanta}
                setForm={setForm}
            />
            <Input
                label="Ubigeo"
                name="ubigeo"
                type="text"
                value={form.ubigeo}
                setForm={setForm}
            />
            <Input
                label="Coordenadas UTM WGS84 (NORTE)"
                name="coordenadasUtmWgs84Norte"
                placeholder="Norte , Ej: 8765432"
                type="number"
                value={form.coordenadasUtmWgs84Norte}
                setForm={setForm}
            />
            <Input
                label="Coordenadas UTM WGS84 (ESTE)"
                name="coordenadasUtmWgs84Este"
                placeholder="Este , Ej: -123456"
                type="number"
                value={form.coordenadasUtmWgs84Este}
                setForm={setForm}
            />
            <Input
                label="Zona"
                name="zona"
                type="select"
                value={form.zona}
                setForm={setForm}
            />
            <Input
                label="Actividad Economica"
                name="actividadEconomica"
                type="text"
                value={form.actividadEconomica}
                setForm={setForm}
            />
            <Input
                label="Sector / Subsector"
                name="sectorSubsector"
                type="text"
                value={form.sectorSubsector}
                setForm={setForm}
            />
            <Input
                label="Responsable de gestion"
                name="responsableGestion"
                type="text"
                value={form.responsableGestion}
                setForm={setForm}
            />
            <Input
                label="Cargo del responsable"
                name="cargoResponsable"
                type="text"
                value={form.cargoResponsable}
                setForm={setForm}
            />
            <Input
                label="DNI / CE responsable"
                name="documentoResponsable"
                type="text"
                value={form.documentoResponsable}
                setForm={setForm}
            />
            <Input
                label="Correo del responsable"
                name="correoResponsable"
                type="email"
                value={form.correoResponsable}
                setForm={setForm}
            />
            <Input
                label="Telefono del responsable"
                name="telefonoResponsable"
                type="text"
                value={form.telefonoResponsable}
                setForm={setForm}
            />
            <Input
                label="IGA aprobado"
                name="igaAprobado"
                type="select"
                options={["SI", "NO"]}
                value={form.igaAprobado}
                setForm={setForm}
            />
            {
                form.igaAprobado === "SI" && (
                    <>
                        <Input
                            label="Institucion que aprueba"
                            name="institucionAprueba"
                            type="text"
                            value={form.institucionAprueba}
                            setForm={setForm}
                        />
                        <Input
                            label="Fecha de aprobacion"
                            name="fechaAprobacion"
                            type="date"
                            value={form.fechaAprobacion}
                            setForm={setForm}
                        />
                        <Input
                            label="Nro de resolucion"
                            name="nroResolucion"
                            type="text"
                            value={form.nroResolucion}
                            setForm={setForm}
                        />
                    </>
                )
            }
        </div>
    );
}

export default DatosGenerales;