import { useEffect, useState } from "react";
import axios from "./axios";
import { setMessage } from "../redux/actions";

export const axiosOptions = () => {
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const modulesResponse = await axios.get("/getModules");
        const permissionsResponse = await axios.get("/getPermissions");
        const submodulesResponse = await axios.get("/getSubmodules");
        const employeesResponse = await axios.get("/employee");

        setModules(modulesResponse.data);
        setPermissions(permissionsResponse.data);
        setSubmodules(submodulesResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        setError("Error fetching options");
      }
    };

    fetchOptions();
  }, []);

  return { modules, submodules, permissions, employees, error };
};

