import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { uploadImage } from "../utils/uploadImage";

function CreateObra() {
  const navigate = useNavigate();
  const [galerias, setGalerias] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    obra: "",
    artista: "",
    tecnica: "",
    precio: "",
    imagen_url: "",
    galeria: ""
  });

  useEffect(() => {
    API.get("/galerias/").then((res) => setGalerias(res.data));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // subir imagen si existe
      let imageUrl = form.imagen_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "obras");
      }

      await API.post("/obras/", {
        ...form,
        imagen_url: imageUrl,
        precio: parseFloat(form.precio)
      });

      navigate("/obras");
    } catch (err) {
        console.error(err)
      alert("Error subiendo obra");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Nueva Obra</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Título de la Obra"
          onChange={(e) => setForm({ ...form, obra: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Artista"
          onChange={(e) => setForm({ ...form, artista: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Técnica"
          onChange={(e) => setForm({ ...form, tecnica: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="Precio"
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          required
        />

        {/* Imagen */}
        <label className="font-semibold block">Imagen de la Obra</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, galeria: e.target.value })}
          required
        >
          <option value="">Selecciona una Galería</option>
          {galerias.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Guardando..." : "Guardar Obra"}
        </button>
      </form>
    </div>
  );
}

export default CreateObra;
