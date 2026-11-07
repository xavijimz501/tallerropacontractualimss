import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5042/tallerropacontractualimss/api",
  baseURL: "https://upsrc.buengobierno.gob.mx/tallerropacontractualimss/api",
});

export const obtenerRegistros = async () => {
  const { data } = await api.get("/");
  return data;
};

export const crearRegistro = async (registro) => {
  const { data } = await api.post("/", registro);
  return data;
};

export const obtenerEstados = async () => {
  const { data } = await api.get("/estados");
  return data;
}

export const login = async (correo, password) => {
  const { data } = await api.post("/login", { correo, password });
  return data;
}

export const obtenerCategoriasGenerales = async () => {
  const { data } = await api.get("/categorias-generales");
  return data;
};

export const obtenerFamilias = async (idCatGeneral) => {
  const { data } = await api.get(
    `/familias?id_cat_general=${idCatGeneral}`
  );

  return data;
};