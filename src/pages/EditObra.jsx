import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditObra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [galerias, setGalerias] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    API.get(`/obras/${id}/`).then(res => setForm(res.data));
    API.get("/galerias/").then(res => setGalerias(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/obras/${id}/`, form);
    navigate("/obras");
  };

  return (
    <form onSubmit={submit}>
      <h2>Editar Obra</h2>

      <input value={form.obra || ""} onChange={e => setForm({...form, obra: e.target.value})} />
      <input value={form.artista || ""} onChange={e => setForm({...form, artista: e.target.value})} />
      <input value={form.tecnica || ""} onChange={e => setForm({...form, tecnica: e.target.value})} />
      <input value={form.precio || ""} type="number" onChange={e => setForm({...form, precio: e.target.value})} />
      <input value={form.imagen_url || ""} onChange={e => setForm({...form, imagen_url: e.target.value})} />

      <select value={form.galeria || ""} onChange={e => setForm({...form, galeria: e.target.value})}>
        <option value="">Selecciona una Galería</option>
        {galerias.map(g => (
          <option key={g.id} value={g.id}>{g.nombre}</option>
        ))}
      </select>

      <button>Guardar cambios</button>
    </form>
  );
}

export default EditObra;
