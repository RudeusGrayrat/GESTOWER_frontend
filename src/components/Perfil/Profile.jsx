import PDetail from "../../recicle/PDtail";

const Profile = ({ user }) => {
  const {
    name,
    lastname,
    business,
    documentNumber,
    documentType,
    state,
    dateStart,
    photo,
    charge,
    location,
    email,
    dateOfBirth,
    phone,
    sede,
    modules,
  } = user;

  return (
    <div
      className="flex flex-col items-center z-50 h-full justify-start "
      style={{ fontFamily: "Roboto" }}
    >
      <div className="overflow-y-auto max-h-[400px] border-gray-50 shadow-xl border-2 rounded-xl  bg-white w-[95%] m-3 p-5 flex items-center justify-evenly">
        <div className="flex w-96 items-center justify-center  rounded-full">
          <img
            src={photo}
            width={300}
            height={300}
            className="shadow-inner rounded-full object-cover"
            alt="Profile"
          />
        </div>
        <div className="w-[65%] flex flex-col justify-center">
          <span className="text-4xl font-semibold mb-2 text-sky-600 ">
            {lastname + " " + name}
          </span>
          <div className="flex flex-row ">
            <div className="flex flex-col h-52 w-96 overflow-x-auto overflow-y-auto gap-1.5">
              <PDetail content="Cargo:" value={charge} tamaño="text-xl" />
              <PDetail content="Empresa:" value={business} tamaño="text-xl" />
              <PDetail content="Fecha de inicio:" value={dateStart} tamaño="text-xl" />
              <PDetail content="Fecha de cumpleaños:" value={dateOfBirth} tamaño="text-xl" />
              <PDetail content="Estado:" value={state} tamaño="text-xl" />
            </div>
            <div className="flex flex-col w-96 h-52 overflow-y-auto ml-9 gap-1.5">
              <PDetail content="Tipo de Documento:" value={documentType} tamaño="text-xl" />
              <PDetail content="Número de Documento:" value={documentNumber} tamaño="text-xl" />
              <PDetail content="Celular:" value={phone} tamaño="text-xl" />
              <PDetail content="Sede:" value={sede} tamaño="text-xl" />
              <PDetail content="Email:" value={email} tamaño="text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 max-h-[300px]  flex justify-evenly border-gray-50 shadow-xl bg-white rounded-xl w-[95%] m-3 p-5   ">
        <div className="w-96 overflow-y-auto flex flex-col text-start gap-1.5">
          <span className="text-4xl mb-2 text-sky-600 ">Dirección</span>
          <PDetail content="Sede:" value={sede} tamaño="text-xl" />
          <PDetail content="Departamento:" value={location.departamento} tamaño="text-xl" />
          <PDetail content="Provincia:" value={location.provincia} tamaño="text-xl" />
          <PDetail content="Distrito:" value={location.distrito} tamaño="text-xl" />
          <PDetail content="Ubicación:" value={location.direccion} tamaño="text-xl" />
        </div>
        <div className="w-[65%]">
          <span className="text-4xl text-sky-600 ">Módulos</span>
          {modules.length > 0 ? (
            <div className="h-44 mt-2 overflow-y-auto grid gap-3">
              {modules?.map((module, index) => (
                <div key={index} className="border flex flex-wrap rounded-lg p-3 gap-x-2">
                  <span className="text-xl text-sky-600 ">
                    Módulo: <span className="text-black">{module.name}</span>
                  </span>
                  {"  "}
                  <span className="text-xl text-sky-600 ">
                    Submódulo:{"  "}
                    <span className="text-black">{module.submodule.name}</span>
                  </span>{" "}
                  <span className="text-xl text-sky-600 ">
                    Permisos:{" "}
                    <span className="text-black">
                      {module.submodule.permissions.join(", ")}
                    </span>
                  </span>
                  <br />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-2xl my-1 text-sky-600 ">
              No tiene módulos asignados
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
