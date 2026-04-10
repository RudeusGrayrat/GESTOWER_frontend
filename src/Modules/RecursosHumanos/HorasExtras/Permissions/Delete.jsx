import Delete from "../../../../components/Principal/Permissions/Delete"

const DeletehorasExtras = ({ setShowDelete, selected, reload }) => {
    const handleDelete = () => {
        console.log("Eliminando horas extras...");
    }
    return (
        <Delete
            setShowDelete={setShowDelete}
            onclick={handleDelete}
            text={"Está seguro de querer eliminar"}
        >
        </Delete>
    )
}

export default DeletehorasExtras