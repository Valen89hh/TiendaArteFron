import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { uploadImage } from "../utils/uploadImage";

function EditObra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [galerias, setGalerias] = useState([]);
  const [form, setForm] = useState({
    obra: "",
    artista: "",
    tecnica: "",
    precio: "",
    imagen_url: "",
    galeria: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      const obraRes = await API.get(`/obras/${id}/`);
      const galRes = await API.get("/galerias/");
      setForm(obraRes.data);
      setGalerias(galRes.data);
      setPreview(obraRes.data.imagen_url);
    };
    fetchData();
  }, [id]);

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Guardar cambios
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagenUrl = form.imagen_url;
      if (file) {
        imagenUrl = await uploadImage(file, "obras");
      }

      await API.put(`/obras/${id}/`, { ...form, imagen_url: imagenUrl });
      navigate("/obras");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar obra
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/obras/${id}/`);
      navigate("/obras");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar la obra.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={submit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Editar Obra
        </h2>

        {/* Obra */}
        <div>
          <label className="block font-medium text-gray-700">Título de la obra</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            value={form.obra}
            onChange={(e) => setForm({ ...form, obra: e.target.value })}
            placeholder="Nombre de la obra"
          />
        </div>

        {/* Artista */}
        <div>
          <label className="block font-medium text-gray-700">Artista</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            value={form.artista}
            onChange={(e) => setForm({ ...form, artista: e.target.value })}
            placeholder="Nombre del artista"
          />
        </div>

        {/* Técnica */}
        <div>
          <label className="block font-medium text-gray-700">Técnica</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            value={form.tecnica}
            onChange={(e) => setForm({ ...form, tecnica: e.target.value })}
            placeholder="Ej. Óleo sobre lienzo"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block font-medium text-gray-700">Precio (S/)</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            placeholder="Ej. 2500"
          />
        </div>

        {/* Galería */}
        <div>
          <label className="block font-medium text-gray-700">Galería</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            value={form.galeria || ""}
            onChange={(e) => setForm({ ...form, galeria: e.target.value })}
          >
            <option value="">Selecciona una galería</option>
            {galerias.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div>
          <label className="block font-medium text-gray-700">Imagen de la obra</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <img
              src={preview}
              alt="Vista previa"
              className="w-full h-48 object-cover rounded-lg border"
            />
            {file && (
              <p className="text-sm text-gray-500 text-center mt-1">
                Imagen nueva seleccionada
              </p>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className={`flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium transition hover:bg-blue-700 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium transition hover:bg-red-700"
          >
            Eliminar obra
          </button>
        </div>
      </form>

      {/* Modal eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              ¿Estás seguro de eliminar esta obra?
            </h3>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                  deleting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditObra;
