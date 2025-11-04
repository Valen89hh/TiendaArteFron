import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { uploadImage } from "../utils/uploadImage";

function CreateGaleria() {
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    descripcion: "",
    foto_url: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let fotoUrl = form.foto_url;

    // Subir la imagen si el usuario eligió una
    if (file) fotoUrl = await uploadImage(file, "galerias");

    await API.post("/galerias/", { ...form, foto_url: fotoUrl });

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={submit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Nueva Galería
        </h2>

        <div>
          <label className="block font-medium text-gray-700">Nombre</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nombre de la galería"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Ubicación</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Ubicación"
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Descripción</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Descripción"
            rows="3"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Imagen</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Galería"}
        </button>
      </form>
    </div>
  );
}

export default CreateGaleria;
