import Details from "../../../../components/Principal/Permissions/View";

const DetaiStock = ({ setShowDetail, selected, reload }) => {
    const id = selected._id;

    const update = async () => {
        // Aquí puedes hacer la llamada a la API para obtener los detalles del manifiesto usando el ID
        // Por ejemplo:
        // const response = await axios.get(`/certificaciones/getManifiestoById/${id}`);
        // const data = response.data;
        // Luego puedes pasar 'data' a tu componente de detalles para mostrar la información
    }
    return (
        <Details setShowDetail={setShowDetail} update={update}>

        </Details>
    );
}

export default DetaiStock;