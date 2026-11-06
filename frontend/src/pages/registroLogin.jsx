import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/registroService.jsx";
import axios from "axios";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.correo || !form.password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const data = await login(form.correo, form.password);

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Guardar el token de autenticación
      localStorage.setItem("token", data.token);

      // Ir al panel administrativo
      navigate("/admin");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setError(
        error.response?.data?.message ||
          "No fue posible iniciar sesión. Intenta nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>Acceso administrativo</h1>

          <p>
            Ingresa tus credenciales para acceder al sistema de administración.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">
              Correo <span>*</span>
            </label>

            <input
              type="email"
              id="correo"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span>*</span>
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <button
          type="button"
          className="btn-regresar-login"
          onClick={() => navigate("/")}
        >
          Regresar al inicio
        </button>
      </section>
    </main>
  );
}
