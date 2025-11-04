import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function GaleriasList() {
  const [galerias, setGalerias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [obras, setObras] = useState([]);
  const [galeriaSeleccionada, setGaleriaSeleccionada] = useState(null);

  useEffect(() => {
    API.get("/galerias/").then((res) => {
        console.log(res)
        setGalerias(res.data)
    });
  }, []);

  const fetchObras = async (galeriaId, nombre) => {
    setGaleriaSeleccionada(nombre);
    const res = await API.get(`/galerias/${galeriaId}`);
    setObras(res.data.obras);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Galerías de Arte</h2>
        <Link
          to="/galerias/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nueva Galería
        </Link>
      </div>

      {galerias.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay galerías registradas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galerias.map((g) => (
            <div
              key={g.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={g.foto_url || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
                alt={g.nombre}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{g.nombre}</h3>
                <p className="text-gray-600">{g.ubicacion}</p>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/galerias/edit/${g.id}`}
                    className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => fetchObras(g.id, g.nombre)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Ver Obras
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-5 relative">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Obras de {galeriaSeleccionada}
            </h3>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-xl bg-gray-200 rounded-full px-2 hover:bg-gray-300"
            >
              ✕
            </button>

            <div className="max-h-96 overflow-y-auto space-y-4">
              {obras.length === 0 ? (
                <p className="text-gray-500 text-center">No hay obras registradas.</p>
              ) : (
                obras.map((o) => (
                  <div key={o.id} className="border rounded-lg p-3 flex gap-3">
                    <img
                      src={o.imagen_url || "https://via.placeholder.com/100?text=Sin+Imagen"}
                      alt={o.obra}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{o.tecnica}</p>
                      <p className="text-sm text-gray-600">{o.artista}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GaleriasList;
