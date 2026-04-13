import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "../stilos.css";
import { TimePicker } from "@mui/x-date-pickers";
const InputTime = ({
  label,
  setForm,
  value,
  name,
  errorOnclick,
  ancho = "",
  ...otrasProps
}) => {
  const [fecha, setFecha] = useState(null);
  const [error, setError] = useState(false);
  const [animation, setAnimation] = useState(false);
  const setFormRef = useRef(setForm);
  const parsedValue = value ? dayjs(value, "hh:mm A") : null;
  useEffect(() => {
    setFormRef.current = setForm;
  }, [setForm]);
  useEffect(() => {
    if (value) {
      const parsed = dayjs(value, "hh:mm A");
      if (!parsed.isSame(fecha)) {
        setFecha(parsed);
      }
    }
  }, [value]);

  const styleError = "border-red-500 animate-shake";
  const styleNormal = "border-gray-300";
  const estiloInput = `${ancho} bg-white h-10 w-60  ${animation ? styleError : styleNormal}`;
  useEffect(() => {
    if (fecha) {
      setFormRef.current((prevData) => ({  // <- usar ref en vez de setForm directo
        ...prevData,
        [name]: fecha.format("hh:mm A"),
      }));
      setError(false);
      setAnimation(false);
    }
  }, [fecha, name]);
  // Controlar el error y animación en base al prop errorOnclick
  useEffect(() => {
    if (errorOnclick) {
      setAnimation(true);
      setError(true);
    } else {
      setAnimation(false);
      setError(false);
    }
  }, [errorOnclick]);

  const handleBlur = () => {
    if (!fecha) {
      setError(true);
      setAnimation(true);
    }
  };

  return (
    <div className="flex flex-col mx-3 h-20">
      <label
        className={`text-base font-medium ${error ? "text-red-500" : "text-gray-700"
          }`}
      >
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <TimePicker
            onBlur={handleBlur}
            className={estiloInput}
            value={fecha || parsedValue}
            onChange={(newData) => setFecha(newData)}
            {...otrasProps}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default InputTime;
