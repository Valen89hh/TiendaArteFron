import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditGaleria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    API.get(`/galerias/${id}/`).then(res => setForm(res.data));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    API.put(`/galerias/${id}/`, form).then(() => navigate("/galerias"));
  };

  return (
    <form onSubmit={submit}>
      <h2>Editar Galería</h2>
      <input value={form.nombre || ""} onChange={e => setForm({ ...form, nombre: e.target.value })} />
      <input value={form.ubicacion || ""} onChange={e => setForm({ ...form, ubicacion: e.target.value })} />
      <textarea value={form.descripcion || ""} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
      <input value={form.foto_url || ""} onChange={e => setForm({ ...form, foto_url: e.target.value })} />
      <button>Guardar cambios</button>
    </form>
  );
}

export default EditGaleria;
