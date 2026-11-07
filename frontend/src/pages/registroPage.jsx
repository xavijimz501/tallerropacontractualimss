import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  crearRegistro,
  obtenerEstados,
  obtenerCategoriasGenerales,
  obtenerFamilias,
} from "../services/registroService";

import "../App.css";

// const sectoresDisponibles = [
//   "Uniformes",
//   "Ropa deportiva",
//   "Ropa industrial",
//   "Ropa casual",
//   "Ropa de trabajo",
// ];

const estadoInicial = {
  nombre: "",
  genero: "",
  correo: "",
  telefono: "",
  nombre_representante: "",
  telefono_representante: "",
  correo_representante: "",
  estado: "",
  venta_gobierno: "",
  nombre_comercial: "",
  razon_social: "",
  rfc: "",
  tamanio_empresa: "",
  sectores: [],
  tipo_empresa: [],
  categoria_general: "",
  familia: "",
  bienes_servicios: [],
  cobertura: "",
  coberturas: [],
  numero_empleados: 0,
  descripcion: "",
};

// const mensajesTamanioEmpresa = {
//   Micro: (
//     <>
//       <strong>Micro:</strong> hasta 10 trabajadores con ventas anuales de hasta
//       4 mdp.
//     </>
//   ),

//   Pequeña: (
//     <>
//       <strong>Pequeña:</strong>
//       <ul>
//         <li>
//           <strong>Comercio:</strong> de 11 a 30 trabajadores con ventas anuales
//           de 42.01 a 100 mdp.
//         </li>
//         <li>
//           <strong>Industria y servicios:</strong> de 11 a 50 trabajadores con
//           ventas anuales de 4.01 a 100 mdp.
//         </li>
//       </ul>
//     </>
//   ),

//   Mediana: (
//     <>
//       <strong>Mediana:</strong>
//       <ul>
//         <li>
//           <strong>Comercio:</strong> de 31 a 100 trabajadores con ventas anuales
//           de 100.01 a 250 mdp.
//         </li>
//         <li>
//           <strong>Servicios:</strong> de 50 a 100 trabajadores con ventas
//           anuales de 100.01 a 250 mdp.
//         </li>
//         <li>
//           <strong>Industria:</strong> de 50 a 250 trabajadores con ventas
//           anuales de 100.01 a 250 mdp.
//         </li>
//       </ul>
//     </>
//   ),

//   Grande: (
//     <>
//       <strong>Grande:</strong> más de 250 trabajadores y más de 251 mdp en
//       ventas anuales.
//     </>
//   ),
// };

export default function RegistroPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [estados, setEstados] = useState([]);
  // const [sectoresAbierto, setSectoresAbierto] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const [categoriasGenerales, setCategoriasGenerales] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [mostrarCoberturas, setMostrarCoberturas] = useState(false);

  useEffect(() => {
    const cargarEstados = async () => {
      try {
        const data = await obtenerEstados();
        setEstados(data);
      } catch (error) {
        console.error(error);
      }
    };

    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategoriasGenerales();
        setCategoriasGenerales(data);
      } catch (error) {
        console.error("Error al cargar categorías generales:", error);
      }
    };

    cargarEstados();
    cargarCategorias();
  }, []);

  const handleCategoriaChange = async (e) => {
    const idCategoria = e.target.value;

    setForm((prev) => ({
      ...prev,
      categoria_general: idCategoria,
      familia: "",
    }));

    if (!idCategoria) {
      setFamilias([]);
      return;
    }

    try {
      const data = await obtenerFamilias(idCategoria);

      setFamilias(data);
    } catch (error) {
      console.error("Error al cargar familias:", error);

      setFamilias([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombre" || name === "nombre_representante") {
      const soloLetras = value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]/g, "");

      setForm((prev) => ({
        ...prev,
        [name]: soloLetras,
      }));

      return;
    }

    if (name === "telefono" || name === "telefono_representante") {
      const soloNumeros = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        [name]: soloNumeros,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setError("");
    setExito("");

    // Validaciones básicas
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!form.correo.trim()) {
      setError("El correo es obligatorio.");
      return;
    }

    if (!emailRegex.test(form.correo.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (!form.telefono.trim()) {
      setError("El teléfono es obligatorio.");
      return;
    }

    if (!form.nombre_representante.trim()) {
      setError("El nombre del representante es obligatorio.");
      return;
    }

    if (!form.telefono_representante.trim()) {
      setError("El teléfono del representante es obligatorio.");
      return;
    }

    if (!form.correo_representante.trim()) {
      setError("El correo del representante es obligatorio.");
      return;
    }

    if (!emailRegex.test(form.correo_representante.trim())) {
      setError("Ingresa un correo válido para el representante.");
      return;
    }

    if (!form.descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (!form.estado) {
      setError("Selecciona el estado.");
      return;
    }

    if (!form.venta_gobierno) {
      setError("Indica si la empresa ha vendido al gobierno.");
      return;
    }

    if (!form.razon_social) {
      setError("Selecciona la razon social.");
      return;
    }

    if (!form.rfc) {
      setError("Selecciona el rfc.");
      return;
    }

    if (!form.numero_empleados) {
      setError("Selecciona el numero empleados.");
      return;
    }

    if (form.coberturas.length === 0) {
      setError("Agrega al menos un estado de cobertura.");
      return;
    }

    if (form.bienes_servicios.length === 0) {
      setError("Agrega al menos un bien o servicio.");
      return;
    }

    if (form.tipo_empresa.length === 0) {
      setError("Selecciona al menos un tipo de empresa.");
      return;
    }

    if (!confirmado) {
      setError("Debes confirmar que los datos capturados son correctos.");
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        ...form,
        numero_empleados:
          form.numero_empleados === "" ? null : Number(form.numero_empleados),
        coberturas: form.coberturas.map((item) => item.id_estado),
      };

      const resultado = await crearRegistro(payload);

      console.log("Registro creado:", resultado);

      setExito(`Registro creado correctamente. Folio: ${resultado.id}`);
      setRegistroExitoso(true);

      setForm(estadoInicial);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Ocurrió un error al guardar el registro.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleSectorChange = (sector) => {
    setForm((prev) => {
      const yaSeleccionado = prev.sectores.includes(sector);

      return {
        ...prev,
        sectores: yaSeleccionado
          ? prev.sectores.filter((item) => item !== sector)
          : [...prev.sectores, sector],
      };
    });
  };

  const agregarBienServicio = () => {
    if (!form.categoria_general || !form.familia) {
      return;
    }

    const categoriaSeleccionada = categoriasGenerales.find(
      (categoria) => categoria.id === Number(form.categoria_general),
    );

    const familiaSeleccionada = familias.find(
      (familia) => familia.id === Number(form.familia),
    );

    if (!categoriaSeleccionada || !familiaSeleccionada) {
      return;
    }

    // Evitar que agreguen exactamente la misma combinación
    const yaExiste = form.bienes_servicios.some(
      (item) =>
        item.id_cat_general === Number(form.categoria_general) &&
        item.id_familia === Number(form.familia),
    );

    if (yaExiste) {
      alert("Esta combinación ya fue agregada.");
      return;
    }

    setForm((prev) => ({
      ...prev,

      bienes_servicios: [
        ...prev.bienes_servicios,
        {
          id_cat_general: categoriaSeleccionada.id,
          categoria: categoriaSeleccionada.nombre,
          id_familia: familiaSeleccionada.id,
          familia: familiaSeleccionada.nombre,
        },
      ],

      // Limpiar familia para poder agregar otra
      familia: "",
    }));
  };

  const eliminarBienServicio = (index) => {
    setForm((prev) => ({
      ...prev,
      bienes_servicios: prev.bienes_servicios.filter((_, i) => i !== index),
    }));
  };

  const agregarCobertura = () => {
    if (!form.cobertura) {
      return;
    }

    const idEstado = Number(form.cobertura);

    const estadoSeleccionado = estados.find(
      (item) => item.id_entidad === idEstado,
    );

    if (!estadoSeleccionado) {
      return;
    }

    const yaExiste = form.coberturas.some(
      (item) => item.id_estado === idEstado,
    );

    if (yaExiste) {
      alert("Este estado ya fue agregado.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      coberturas: [
        ...prev.coberturas,
        {
          id_estado: estadoSeleccionado.id_entidad,
          estado: estadoSeleccionado.entidad_federativa,
        },
      ],
      cobertura: "",
    }));
  };

  const eliminarCobertura = (index) => {
    setForm((prev) => ({
      ...prev,
      coberturas: prev.coberturas.filter((_, i) => i !== index),
    }));
  };

  const toggleCobertura = (estado) => {
    setForm((prev) => {
      const existe = prev.coberturas.some(
        (item) => item.id_estado === estado.id_entidad,
      );

      if (existe) {
        return {
          ...prev,
          coberturas: prev.coberturas.filter(
            (item) => item.id_estado !== estado.id_entidad,
          ),
        };
      }

      return {
        ...prev,
        coberturas: [
          ...prev.coberturas,
          {
            id_estado: estado.id_entidad,
            estado: estado.entidad_federativa,
          },
        ],
      };
    });
  };

  return (
    <>
      {registroExitoso ? (
        <section className="registro-exitoso">
          <h2>Mensaje de confirmación</h2>
          <p> Tu registro se ha realizado correctamente. </p>
          <p>
            A más tardar 24 horas antes del curso, capacitación o reunión,
            recibirás en la dirección de correo electrónico que proporcionaste
            en este formulario las instrucciones de acceso.
          </p>
          <p className="mensaje-cierre">
            <strong>Para finalizar, cierra la pestaña del navegador.</strong>
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ marginBottom: "20px" }}
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </button>
        </section>
      ) : (
        <main className="registro-page">
          <div className="registro-container">
            <div className="registro-header">
              <button
                type="button"
                className="btn-regresar"
                onClick={() => navigate("/")}
              >
                ← Regresar
              </button>
              <br />
              <p>
                Completa el siguiente formulario para registrar tu MIPYME y
                mantenerte informado sobre las actividades y oportunidades
                de participación en las compras públicas.
              </p>
              <br />
              <p>
                Verifica que la información proporcionada sea correcta antes de enviarla.
                <strong> Todos los campos son obligatorios.</strong>
              </p>
            </div>

            <form className="registro-form" onSubmit={handleSubmit}>
              {/* =========================
              INFORMACIÓN GENERAL
              ========================= */}

              <section className="form-section">
                <h2>Información general de tu MIPYME</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nombre">
                      Nombre de la persona que realiza el registro
                    </label>

                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre"
                      maxLength={150}
                    />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="genero">
                      Género 
                    </label>

                    <select
                      id="genero"
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="No especificado">No especificado</option>
                    </select>
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="correo">Correo electrónico</label>

                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      maxLength={150}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Número de teléfono celular</label>

                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="Número telefónico"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>

                <br />

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nombre_representante">
                      Nombre del representante legal de la empresa
                    </label>
                    <input
                      id="nombre_representante"
                      name="nombre_representante"
                      type="text"
                      value={form.nombre_representante}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre"
                      maxLength={150}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo_representante">Correo electrónico</label>
                    <input
                      id="correo_representante"
                      name="correo_representante"
                      type="email"
                      value={form.correo_representante}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      maxLength={150}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono_representante">Número de teléfono celular</label>
                    <input
                      id="telefono_representante"
                      name="telefono_representante"
                      type="tel"
                      value={form.telefono_representante}
                      onChange={handleChange}
                      placeholder="Número telefónico"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>
              </section>

              {/* =========================
              INFORMACIÓN DE LA EMPRESA
              ========================= */}

              <section className="form-section">
                <h2>Información de la empresa</h2>

                <div className="form-grid">
                  {/* <div className="form-group">
                    <label htmlFor="nombre_comercial">Nombre comercial</label>

                    <input
                      id="nombre_comercial"
                      name="nombre_comercial"
                      type="text"
                      value={form.nombre_comercial}
                      onChange={handleChange}
                      placeholder="Nombre comercial"
                      maxLength={150}
                    />
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="nombre_comercial">Nombre comercial</label>

                    <input
                      id="nombre_comercial"
                      name="nombre_comercial"
                      type="text"
                      // value={form.razon_social}
                      onChange={handleChange}
                      placeholder="Nombre comercial"
                      maxLength={200}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rfc">RFC de la empresa</label>

                    <input
                      id="rfc"
                      name="rfc"
                      type="text"
                      value={form.rfc}
                      onChange={handleChange}
                      placeholder="RFC"
                      maxLength={13}
                      style={{ textTransform: "uppercase" }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="razon_social">Razón Social</label>

                    <input
                      id="razon_social"
                      name="razon_social"
                      type="text"
                      value={form.razon_social}
                      onChange={handleChange}
                      placeholder="Razón social"
                      maxLength={200}
                    />
                  </div>



                  <div className="form-group">
                    <label htmlFor="numero_empleados">
                      Número de personas trabajadoras
                    </label>

                    <input
                      id="numero_empleados"
                      name="numero_empleados"
                      type="number"
                      value={form.numero_empleados}
                      onChange={handleChange}
                      placeholder="Número de empleados"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="estado">
                      Entidad Federativa donde se ubica la MIPYME
                    </label>

                    <select
                      id="estado"
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona un estado</option>

                      {estados.map((estado) => (
                        <option
                          key={estado.id_entidad}
                          value={estado.id_entidad}
                        >
                          {estado.entidad_federativa}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tipo de empresa</label>

                    <div className="opciones-multiples">
                      {["Fabricante", "Distribuidor", "Comercializadora", "Prestadora de servicios"].map(
                        (opcion) => (
                          <label key={opcion} className="opcion-checkbox">
                            <input
                              type="checkbox"
                              checked={form.tipo_empresa.includes(opcion)}
                              onChange={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  tipo_empresa: prev.tipo_empresa.includes(
                                    opcion,
                                  )
                                    ? prev.tipo_empresa.filter(
                                      (item) => item !== opcion,
                                    )
                                    : [...prev.tipo_empresa, opcion],
                                }));
                              }}
                            />

                            <span>{opcion}</span>
                          </label>
                        ),
                      )}
                    </div>

                    <small>
                      Selecciona todas las opciones que correspondan.
                    </small>
                  </div>

                  <div className="form-row">
                    {/* Cobertura */}
                    <div className="form-group">
                      <label>
                        Entidades federativas donde puede suministrar bienes o prestar servicios
                      </label>

                      <div className="multiselect">
                        {/* Campo principal */}
                        <div
                          className="multiselect-control"
                          onClick={() => setMostrarCoberturas((prev) => !prev)}
                        >
                          {form.coberturas.length === 0 ? (
                            <span className="multiselect-placeholder">
                              Selecciona uno o más estados
                            </span>
                          ) : (
                            <div className="multiselect-tags">
                              {form.coberturas.map((item) => (
                                <span
                                  key={item.id_estado}
                                  className="multiselect-tag"
                                >
                                  {item.estado}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      toggleCobertura({
                                        id_entidad: item.id_estado,
                                        entidad_federativa: item.estado,
                                      });
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="multiselect-arrow">▼</span>
                        </div>

                        {/* Opciones */}
                        {mostrarCoberturas && (
                          <div className="multiselect-options">
                            {estados.map((estado) => {
                              const seleccionado = form.coberturas.some(
                                (item) => item.id_estado === estado.id_entidad,
                              );

                              return (
                                <label
                                  key={estado.id_entidad}
                                  className="multiselect-option"
                                >
                                  <input
                                    type="checkbox"
                                    checked={seleccionado}
                                    onChange={() => toggleCobertura(estado)}
                                  />

                                  <span>{estado.entidad_federativa}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="venta_gobierno">
                      ¿La empresa ha vendido al gobierno?
                    </label>
                    <select
                      id="venta_gobierno"
                      name="venta_gobierno"
                      value={form.venta_gobierno}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="tamanio_empresa">
                      Tamaño de empresa 
                    </label>

                    <select
                      id="tamanio_empresa"
                      name="tamanio_empresa"
                      value={form.tamanio_empresa}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una opción</option>

                      <option value="Micro">Micro</option>
                      <option value="Pequeña">Pequeña</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Grande">Grande</option>
                    </select>

                    {form.tamanio_empresa && (
                      <div className="info-tamanio-empresa">
                        {mensajesTamanioEmpresa[form.tamanio_empresa]}
                      </div>
                    )}
                  </div> */}
                </div>
              </section>

              {/* =========================
              SECTORES
              ========================= */}

              <section className="form-section">
                <h2>Bienes y Servicios que ofrece tu MIPYME</h2>
                <div className="form-row">
                  {/* Categoría general */}
                  <div className="form-group">
                    <label htmlFor="categoria_general">Categoría general</label>

                    <select
                      id="categoria_general"
                      name="categoria_general"
                      value={form.categoria_general}
                      onChange={handleCategoriaChange}
                    >
                      <option value="">Selecciona una categoria</option>

                      {categoriasGenerales.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Familia */}
                  <div className="form-group">
                    <label htmlFor="familia">Subcategoría</label>

                    <select
                      id="familia"
                      name="familia"
                      value={form.familia}
                      onChange={handleChange}
                      disabled={!form.categoria_general}
                    >
                      <option value="">
                        {form.categoria_general
                          ? "Selecciona una familia"
                          : "Primero selecciona una categoría"}
                      </option>

                      {familias.map((familia) => (
                        <option key={familia.id} value={familia.id}>
                          {familia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>

                    <input
                      id="descripcion"
                      name="descripcion"
                      type="text"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Texto"
                      maxLength={300}
                    />
                    <small>{form.descripcion.length}/300 caracteres</small>
                  </div>

                  {/* Botón agregar */}
                  <div className="form-group boton-agregar-container">
                    <label>&nbsp;</label>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={agregarBienServicio}
                      disabled={!form.categoria_general || !form.familia}
                    >
                      + Agregar
                    </button>
                  </div>
                </div>

                {/* =========================
        ELEMENTOS AGREGADOS
        ========================= */}

                {form.bienes_servicios.length > 0 && (
                  <div className="bienes-servicios-lista">
                    <h3>Bienes y/o servicios seleccionados</h3>

                    <table className="tabla-bienes-servicios">
                      <thead>
                        <tr>
                          <th>Categoría general</th>
                          <th>Subcategoría</th>
                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {form.bienes_servicios.map((item, index) => (
                          <tr key={`${item.id_cat_general}-${item.id_familia}`}>
                            <td>{item.categoria}</td>

                            <td>{item.familia}</td>

                            <td>
                              <button
                                type="button"
                                className="btn-eliminar"
                                onClick={() => eliminarBienServicio(index)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* <div className="form-group form-group-full">
                  {" "}
                  <label>
                    {" "}
                    ¿En qué sectores participa el taller? {" "}
                  </label>{" "}
                  <div className="multi-select">
                    {" "}
                    <button
                      type="button"
                      className="multi-select-header"
                      onClick={() => setSectoresAbierto(!sectoresAbierto)}
                    >
                      {" "}
                      <span>
                        {" "}
                        {form.sectores.length === 0
                          ? "Selecciona uno o varios sectores"
                          : `${form.sectores.length} sector${form.sectores.length > 1 ? "es" : ""} seleccionado${form.sectores.length > 1 ? "s" : ""}`}{" "}
                      </span>{" "}
                      <span className="multi-select-arrow">
                        {" "}
                        {sectoresAbierto ? "▲" : "▼"}{" "}
                      </span>{" "}
                    </button>{" "}
                    {sectoresAbierto && (
                      <div className="multi-select-options">
                        {" "}
                        {sectoresDisponibles.map((sector) => {
                          const seleccionado = form.sectores.includes(sector);
                          return (
                            <label
                              key={sector}
                              className={`multi-select-option ${seleccionado ? "selected" : ""}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                checked={seleccionado}
                                onChange={() => handleSectorChange(sector)}
                              />{" "}
                              <span>{sector}</span>{" "}
                            </label>
                          );
                        })}{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                  <small>
                    {" "}
                    Selecciona todos los sectores que correspondan.{" "}
                  </small>{" "}
                  {form.sectores.length > 0 && (
                    <div className="sectores-seleccionados">
                      {" "}
                      <strong>Sectores seleccionados:</strong>{" "}
                      <div className="sector-tags">
                        {" "}
                        {form.sectores.map((sector) => (
                          <span key={sector} className="sector-tag">
                            {" "}
                            {sector}{" "}
                            <button
                              type="button"
                              onClick={() => handleSectorChange(sector)}
                              aria-label={`Eliminar ${sector}`}
                            >
                              {" "}
                              ×{" "}
                            </button>{" "}
                          </span>
                        ))}{" "}
                      </div>{" "}
                    </div>
                  )}{" "}
                </div> */}
              </section>

              {/* =========================
              MENSAJES
              ========================= */}

              {error && <div className="form-message form-error">{error}</div>}

              {exito && (
                <div className="form-message form-success">{exito}</div>
              )}

              <div className="aviso-privacidad">
                <p>
                  Para consultar nuestro Aviso de Privacidad,{" "}
                  <a
                    href="/talleres/aviso-privacidad.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    haz clic aquí{" "}
                  </a>
                  .{" "}
                </p>{" "}
              </div>

              {/* =========================
              BOTONES
              ========================= */}

              <div className="form-actions">
                <div className="confirmacion-datos">
                  <label className="confirmacion-label">
                    <input
                      type="checkbox"
                      checked={confirmado}
                      onChange={(e) => setConfirmado(e.target.checked)}
                    />{" "}
                    <span>
                      {" "}
                      ¿Confirmas que los datos capturados son correctos?{" "}
                      <strong>*</strong>{" "}
                    </span>{" "}
                  </label>{" "}
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/")}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Registrar taller"}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
}
