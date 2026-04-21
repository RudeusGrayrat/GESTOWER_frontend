import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Profile from "./Profile";
import axios from "../../api/axios";
import useSendMessage from "../../recicle/senMessage";

const OtherProfiles = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const sendMessage = useSendMessage();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/employee/${id}`);
        setUser(response.data);
      } catch (error) {
        sendMessage(error, "Error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser(); // Solo ejecutar si hay un ID en la URL
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Error al cargar el perfil.</p>;

  return (
    <div className="ml-20 h-[90vh] overflow-hidden">
      <Profile user={user} />;
    </div>
  );
};

export default OtherProfiles;
