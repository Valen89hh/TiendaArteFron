import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { uploadImage } from "../utils/uploadImage";

function EditGaleria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    descripcion: "",
    foto_url: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos existentes
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/galerias/${id}/`);
      setForm(res.data);
      setPreview(res.data.foto_url);
    };
    fetchData();
  }, [id]);

  // Manejar cambio de imagen
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Enviar formulario
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fotoUrl = form.foto_url;

      if (file) {
        fotoUrl = await uploadImage(file, "galerias");
      }

      await API.put(`/galerias/${id}/`, { ...form, foto_url: fotoUrl });
      navigate("/");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar galería
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/galerias/${id}/`);
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar la galería.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={submit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg space-y-4 relative"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Editar Galería
        </h2>

        {/* Nombre */}
        <div>
          <label className="block font-medium text-gray-700">Nombre</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nombre de la galería"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block font-medium text-gray-700">Ubicación</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block font-medium text-gray-700">Descripción</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Descripción"
            rows="3"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          ></textarea>
        </div>

        {/* Imagen */}
        <div>
          <label className="block font-medium text-gray-700">Imagen</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview de imagen */}
        {preview && (
          <div className="relative">
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
        <div className="flex gap-3">
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
            Eliminar galería
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              ¿Estás seguro de eliminar esta galería?
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

export default EditGaleria;
