import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const View = ({ setShowDetail, selected }) => {

  return (
    <Details setShowDetail={setShowDetail}>
      <div className="flex flex-wrap gap-6 h-full w-full overflow-hidden p-3">
        <div className="bg-white p-6 rounded-lg shadow-md gap-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-sky-700">Empresa</h3>
          <PDetail content="Razón Social: " value={selected.razonSocial} />
          <PDetail content="RUC: " value={selected.ruc} />
          <PDetail content="Dirección: " value={selected.domicilioFiscal} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md gap-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-sky-700">Logo</h3>
          <img src={selected.logo} height={500} width={500} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md gap-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-sky-700">Representante</h3>
          <PDetail
            content="Razón Social: "
            value={selected.representative.name}
          />
          <PDetail
            content="Dirección: "
            value={selected.representative.documentType}
          />
          <PDetail
            content="Dirección: "
            value={selected.representative.documentNumber}
          /><img
            src={selected.representative?.signature}
            height={200}
            width={200}
          />
        </div>
      </div>
    </Details>
  );
};

export default View;
