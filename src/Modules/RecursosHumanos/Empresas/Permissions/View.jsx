import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";
import { useEffect, useState } from "react";
import axios from "../../../../api/axios";

const View = ({ setShowDetail, selected }) => {
  const [empresa, setEmpresa] = useState(selected);

  useEffect(() => {
    setEmpresa(selected);
    axios.get(`/business/${selected._id}`)
      .then((response) => setEmpresa(response.data))
      .catch(() => {});
  }, [selected]);

  const representante = empresa.representative || {};
  const Imagen = ({ src, alt, emptyText }) => (
    <div className="flex min-h-44 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="max-h-52 max-w-full rounded-lg object-contain"
        />
      ) : (
        <p className="text-center text-sm text-slate-400">{emptyText}</p>
      )}
    </div>
  );

  return (
    <Details setShowDetail={setShowDetail} title="Empresa">
      <div className="grid h-full w-full grid-cols-1 gap-5 overflow-y-auto p-3 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-sky-700">Datos de la empresa</h3>
          <div className="space-y-3 break-words">
            <PDetail content="Razón social:" value={empresa.razonSocial || "No registrada"} />
            <PDetail content="RUC:" value={empresa.ruc || "No registrado"} />
            <PDetail content="Domicilio fiscal:" value={empresa.domicilioFiscal || "No registrado"} />
          </div>
        </section>
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-sky-700">Logo</h3>
          <Imagen src={empresa.logo} alt={`Logo de ${empresa.razonSocial}`} emptyText="La empresa no tiene logo registrado." />
        </section>
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-sky-700">Representante</h3>
          <div className="space-y-3 break-words">
            <PDetail content="Nombres y apellidos:" value={representante.name || "No registrado"} />
            <PDetail content="Tipo de documento:" value={representante.documentType || "No registrado"} />
            <PDetail content="Número de documento:" value={representante.documentNumber || "No registrado"} />
          </div>
        </section>
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-sky-700">Firma digital</h3>
          <Imagen src={representante.signature} alt={`Firma de ${representante.name || "representante"}`} emptyText="El representante no tiene firma registrada." />
        </section>
      </div>
    </Details>
  );
};

export default View;
