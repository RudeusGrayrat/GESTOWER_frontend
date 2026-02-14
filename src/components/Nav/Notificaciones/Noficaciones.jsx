import { Column } from "primereact/column";
import ListPrincipal from "../../Principal/List/List";
import "../../Principal/List/stylePrueba.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllNotificaciones } from "../../../redux/actions";

const Notificaciones = () => {
  const notificaciones = useSelector((read) => read.allNotificaciones);
  console.log("notificaciones", notificaciones);

  const dispatch = useDispatch();
  useEffect(() => {
    if (notificaciones.length === 0) {
      dispatch(getAllNotificaciones());
    }
  }, [notificaciones]);
  const leido = (item) => {
    // setNotif((prevEjemplo) =>
    //   prevEjemplo.map((ejemplo) =>
    //     ejemplo.user === item.user ? { ...ejemplo, read: true } : ejemplo
    //   )
    // );
  };
  return (
    <div className="ml-20 p-2 mt-10 overflow-auto ">
      {
        <ListPrincipal
          permissionDelete={true}
          EditItem={null}
          rowClick={(item) => leido(item.data)}
          rowClassName={(rowData) => {
            return `cursor-pointer  hover:scale-x-[97%] transition-all duration-200 ${
              rowData[0].read === true
                ? "bg-gradient-to-b from-white to-gray-50"
                : "bg-sky-100"
            }`;
          }}
          DetailItem={null}
          content={notificaciones}
        >
          <Column
            field="creator"
            header="Usuario"
             
            body={(rowData) => {
              return `${rowData?.creator?.lastname} ${rowData?.creator?.name}`;
            }}
          />
          <Column field="title" header="Título" />
          <Column field="message" header="Mensaje" />
          <Column field="type" header="Tipo" />
          <Column
            field="createdAt"
            header="Fecha y Hora"
            body={(rowData) => {
              const date = new Date(rowData.createdAt);
              return date.toLocaleString("es-PE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
          />
          <Column
            field="isRead"
            style={{ justifyItems: "center" }}
            body={(rowData) => {
              const color = rowData.isRead
                ? " text-green-500 "
                : " text-red-500 ";

              return (
                <div
                  className={`text-center bg-gradient-to-tr from-white to-gray-100 
                          shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
                >
                  {rowData.read ? "Leído" : "No leído"}
                </div>
              );
            }}
          ></Column>
        </ListPrincipal>
      }
    </div>
  );
};

export default Notificaciones;
