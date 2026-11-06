const express = require("express");

const {
  obtenerRegistros,
  crearRegistro,
  obtenerEstadosCat,
  login,
  obtenerCategoriasGenerales,
  obtenerFamilias
} = require("../controllers/registro.controller");

const router = express.Router();

router.get("/", obtenerRegistros);
router.post("/", crearRegistro);
router.get("/estados", obtenerEstadosCat);
router.post("/login", login);
router.get("/categorias-generales", obtenerCategoriasGenerales);
router.get("/familias", obtenerFamilias);

module.exports = router;