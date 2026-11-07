import { useEffect, useMemo, useState } from "react";
import { obtenerRegistros } from "../services/registroService.jsx";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../App.css";

export default function Admin() {
  const navigate = useNavigate();

  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerRegistros();

      setRegistros(data);
    } catch (error) {
      console.error("Error al obtener registros:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "No fue posible obtener los registros.",
      );
    } finally {
      setCargando(false);
    }
  };

  const registrosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return registros;
    }

    return registros.filter((registro) =>
      Object.values(registro).some((valor) =>
        String(valor ?? "")
          .toLowerCase()
          .includes(texto),
      ),
    );
  }, [registros, busqueda]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const descargarExcel = () => {
    if (registros.length === 0) {
      alert("No hay registros para descargar.");
      return;
    }

    const datosExcel = registros.map((registro) => ({
      Folio: registro.id,
      Nombre: registro.nombre,
      // Género: registro.genero,
      Correo: registro.correo,
      Teléfono: registro.telefono,
      "Nombre del representante": registro.nombre_representante,
      "Teléfono del representante": registro.telefono_representante,
      "Correo del representante": registro.correo_representante,
      "Venta al gobierno": registro.venta_gobierno,
      Estado: registro.estado,
      Cobertura: registro.cobertura,
      "Numero de empleados": registro.numero_empleados,
      // "Nombre comercial": registro.nombre_comercial,
      "Razón social": registro.razon_social,
      RFC: registro.rfc,
      "Tipo de empresa": registro.tipo_empresa,
      Descripción: registro.descripcion,
      "Categorías generales": registro.categorias_generales,
      Subcategorías: registro.familias,
      // "Tamaño de empresa": registro.tamanio_empresa,
      // Sectores: registro.sectores || "",
      "Fecha de registro": formatearFecha(registro.fecha_registro),
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Registros");

    XLSX.writeFile(libro, "registros_evento.xlsx");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";

    return new Date(fecha).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <h1>Registros</h1>

          <p>Consulta los registros realizados para el evento.</p>
        </div>

        <button
          type="button"
          className="btn-cerrar-sesion"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </section>

      <section className="admin-content">
        <div className="admin-toolbar">
          <div className="admin-total">
            <strong>{registrosFiltrados.length}</strong>
            <span>
              {registrosFiltrados.length === 1 ? " registro" : " registros"}
            </span>
          </div>

          <input
            type="text"
            className="admin-busqueda"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            type="button"
            className="btn-actualizar"
            onClick={cargarRegistros}
          >
            Actualizar
          </button>
          <button type="button" className="btn-excel" onClick={descargarExcel}>
            Descargar Excel
          </button>
        </div>

        {cargando && <div className="admin-mensaje">Cargando registros...</div>}

        {!cargando && error && <div className="admin-error">{error}</div>}

        {!cargando && !error && (
          <div className="tabla-container">
            <table className="tabla-registros">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Nombre del representante</th>
                  <th>Teléfono del representante</th>
                  <th>Correo del representante</th>
                  <th>Ha vendido al gobierno</th>
                  <th>Estado</th>
                  <th className="columna-cobertura">Cobertura</th>
                  <th>Razón social</th>
                  <th>RFC</th>
                  <th>Número de empleados</th>
                  <th>Tipo de empresa</th>
                  <th>Bienes</th>
                  <th>Servicios</th>
                  <th>Descripción</th>
                  <th>Fecha de registro</th>
                </tr>
              </thead>

              <tbody>
                {registrosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="18" className="tabla-vacia">
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  registrosFiltrados.map((registro) => (
                    <tr key={registro.id}>
                      <td>{registro.id}</td>

                      <td>{registro.nombre}</td>

                      <td>{registro.correo}</td>

                      <td>{registro.telefono}</td>

                      <td>{registro.nombre_representante || "—"}</td>

                      <td>{registro.telefono_representante || "—"}</td>

                      <td>{registro.correo_representante || "—"}</td>

                      <td>{registro.venta_gobierno || "—"}</td>

                      <td>{registro.estado}</td>

                      <td className="columna-cobertura">{registro.cobertura || "—"}</td>

                      <td>{registro.razon_social}</td>

                      <td>{registro.rfc}</td>

                      <td>{registro.numero_empleados}</td>

                      <td>{registro.tipo_empresa || "—"}</td>

                      <td>{registro.categorias_generales || "—"}</td>
                      <td>{registro.familias || "—"}</td>
                      <td>{registro.descripcion || "—"}</td>
                      <td>{formatearFecha(registro.fecha_registro)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
