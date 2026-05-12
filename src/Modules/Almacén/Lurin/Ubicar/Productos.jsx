import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const ProductosUbicacion = ({ set, error, initialData }) => {
  console.log("initialData en ProductosUbicacion", initialData);
  const sendMessage = useSendMessage();

  const [data, setData] = useState({
    stockId: "", // Identificador clave ahora
    cantidadDisponible: 0, // Nuevo campo para mostrar la cantidad disponible
    cantidadIngresada: "", // Nombre exacto del modelo Ubicacion
    descripcion: "",
    correlativa: "",
  });
  console.log("data en ProductosUbicacion", data);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  console.log("options en ProductosUbicacion", options);
  const [showSearch, setShowSearch] = useState(true);

  // useEffect ajustado
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setData({
        ...initialData, // Copia todo lo que venga (incluyendo cantidadDisponible)
        stockId: initialData.stockId?._id || initialData.stockId,
        cantidadIngresada: initialData.cantidadIngresada || "",
        correlativa: initialData.correlativa || "",
      });
      setShowSearch(false);
    }
  }, [initialData]);

  // handleSelect ajustado
  const handleSelect = (stockItem) => {
    const newData = {
      stockId: stockItem._id,
      descripcion: stockItem.bienId?.descripcion || stockItem.descripcion,
      cantidadIngresada: "",
      cantidadDisponible: stockItem.cantidadDisponible || 0,
      correlativa: stockItem.correlativaActa || ""
    };

    setData(newData);
    setShowSearch(false);
    setOptions([]);
    set(newData); // Notifica al componente Directorio
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) return setOptions([]);
    try {
      const response = await axios.get(`/getStockAlmacen`, { params: { search: value } });
      setOptions(response.data.data || []);
    } catch (error) {
      sendMessage("Error buscando en stock", "Error");
    }
  };

  const handleInputChange = (name, value) => {
    let val = name === "cantidadIngresada" ? (value === "" ? "" : Number(value)) : value;

    // Si el usuario intenta escribir más de lo que hay, lo frenamos en seco
    if (name === "cantidadIngresada" && val > data.cantidadDisponible) {
      sendMessage(`La cantidad máxima disponible es ${data.cantidadDisponible}`, "Error");
      val = data.cantidadDisponible; // Opcional: forzar al máximo
    }

    const newData = { ...data, [name]: val };
    setData(newData);
    set(newData);
  };
  return (
    <div className="w-full flex flex-wrap px-2 relative">
      {showSearch ? (
        <div className="w-full mb-2 p-2 relative">
          <label className="text-base font-medium text-gray-700">Buscar Item en Stock</label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-1 py-2 border px-3 w-full rounded-md focus:ring-sky-500"
            placeholder="Buscar por descripción..."
          />
          {options.length > 0 && (
            <ul className="absolute top-full left-0 w-full border bg-white rounded-md shadow-2xl z-50 max-h-48 overflow-y-auto">
              {options.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer text-sm border-b last:border-none"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-sky-800">{item.descripcion}</span>

                  </div>
                  <div className="text-xs text-gray-600 mt-1 gap-3 flex">
                    <span>
                      Disponible: <span className="font-bold text-green-700">{item.cantidadDisponible}</span>
                    </span>
                    <span>
                      Unidad de medida: <span className="text-gray-500"> {item.unidadDeMedida}</span>
                    </span>
                    <span>
                      Número de Acta: <span className="text-gray-500"> {item.numeroDeActa}</span>
                    </span>
                    {item.pesoNeto > 0 && `Peso Neto: ${item.pesoNeto} kg`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-wrap justify-center gap-2">
          <Input label="Descripción" value={data.descripcion} disabled />
          <Input label="Correlativa" value={data.correlativa} disabled />
          <Input
            label="Cant. a Ubicar"
            name="cantidadIngresada"
            ancho={"w-44 min-w-32"}
            type="number"
            // Añadimos el máximo disponible para que el navegador ayude
            max={data?.cantidadDisponible}
            value={data.cantidadIngresada}
            onChange={(e) => handleInputChange("cantidadIngresada", e.target.value)}
            errorOnclick={error?.cantidadIngresada}
          />
          <Input ancho={"w-44 min-w-32"} label="Cantidad sin ubicar" value={data.cantidadDisponible} disabled />
        </div>
      )}
    </div>
  );
};

export default ProductosUbicacion;