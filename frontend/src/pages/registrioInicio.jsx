import { useNavigate } from "react-router-dom";

import banner from "../assets/BuenG.jpg";

import "../App.css";

export default function Inicio() {
  const navigate = useNavigate();

  const irARegistro = () => {
    navigate("/registro");
  };

  return (
    <main className="inicio">
      <img src={banner} alt="Registro" className="inicio-banner" />

      <section className="bienvenida">
        {/* <h1>Bienvenida/o</h1> */}
        <p style={{ textAlign: 'justify' }}>
          {" "}
          Como parte de la estrategia Buen Gobierno en Territorio y del trabajo con el sector privado, <strong>la Secretaría Anticorrupción y Buen Gobierno</strong> invita a las micro, pequeñas y medianas empresas (mipymes) interesadas en venderle al Gobierno Federal a registrarse para conocer cómo participar en las compras públicas.
          {" "}
        </p>
        <p style={{ textAlign: 'justify' }}>
          Al registrarse, podrán recibir <strong> información gratuita sobre las actividades de orientación y acompañamiento</strong> y conocer herramientas para identificar oportunidades de venta, entender los requisitos y preparar tus propuestas.

        </p>
        <p style={{ textAlign: 'justify' }}>
          {" "}
          <strong>Completa el siguiente formulario. </strong>Una persona del equipo de la Secretaría se pondrá en contacto contigo para orientarte sobre los primeros pasos.
          {" "}
        </p>
        <p>¡Agradecemos tu interés!</p>

        <button className="btn-registro" onClick={irARegistro}>
          {" "}
          Comenzar registro{" "}
        </button>
      </section>
    </main >
  );
}
