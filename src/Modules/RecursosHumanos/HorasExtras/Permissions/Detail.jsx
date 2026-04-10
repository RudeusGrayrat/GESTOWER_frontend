import { useState } from "react";
import Details from "../../../../components/Principal/Permissions/View"

const DetailHorasExtras = ({ setShowDetail, selected }) => {
    const {
        _id
    } = selected;
    const [showDoc, setShowDoc] = useState(true);
    const [docxContent, setDocxContent] = useState("");
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        docxContent
    )}`;
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Horas Extras" >
            {showDoc ? (
                <div className="flex gap-8 mt-6 ml-10">
                    <a href={officeViewerUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer">
                        <span>
                            Visualizar Word
                        </span>
                        <span className="ml-2 pi pi-eye"></span>
                    </a>
                    <div
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer"
                        onClick={() => setShowDetail(false)}>
                        Descargar <span className="ml-2 pi pi-download"></span>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </Details>
    )
}

export default DetailHorasExtras