import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Input from "../../../../recicle/Inputs/Inputs";
import PopUp from "../../../../recicle/popUps";

const ReportAlmacen = ({
  descargar,
  form,
  setForm,
  title,
  children,
  options,
}) => {
  return (
    <div>
      <CardPlegable title={title}>
        <div className="flex flex-wrap">
          <Input
            label="Contrato"
            name="contrato"
            type="select"
            value={form.contrato}
            setForm={setForm}
            options={options}
          />
          {!children ? (
            <div className="flex">
              <Input
                label="Desde"
                name="desde"
                type="month"
                value={form.desde}
                setForm={setForm}
              />
              <Input
                label="Hasta"
                name="hasta"
                type="month"
                month="true"
                value={form.hasta}
                setForm={setForm}
              />
            </div>
          ) : (
            children
          )}
          <ButtonOk
            classe="mt-4"
            children="Generar Reporte"
            type="ok"
            onClick={descargar}
          />
        </div>
      </CardPlegable>
    </div>
  );
};
export default ReportAlmacen;
