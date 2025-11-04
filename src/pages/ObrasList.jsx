import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ObrasList() {
  const [obras, setObras] = useState([]);

  const getObras = async () => {
    const res = await API.get("/obras/");
    setObras(res.data);
  };

  useEffect(() => {
    getObras();
  }, []);

  const deleteObra = async (id) => {
    if (window.confirm("¿Eliminar esta obra?")) {
      await API.delete(`/obras/${id}/`);
      getObras();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Obras de Arte</h2>

        <Link
          to="/obras/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Obra
        </Link>
      </div>

      {obras.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay obras registradas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {obras.map((obra) => (
            <div
              key={obra.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={obra.imagen_url || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
                alt={obra.obra}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{obra.obra}</h3>
                <p className="text-gray-600 font-medium">{obra.artista}</p>
                <p className="text-gray-700 font-bold mt-2">
                  S/. {obra.precio}
                </p>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/obras/edit/${obra.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => deleteObra(obra.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ObrasList;
