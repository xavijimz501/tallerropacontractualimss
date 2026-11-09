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
        <h1>Bienvenida/o</h1>
        <p style={{ textAlign: 'justify' }}>
          {" "}
          La <strong>Secretaría Anticorrupción y Buen Gobierno </strong>
          invita a las micro, pequeñas y medianas empresas (MIPYMES) interesadas en conocer las oportunidades que ofrecen las compras públicas a registrarse en esta plataforma, con el propósito de fortalecer la vinculación y promover su participación como potenciales proveedoras del Gobierno Federal.
          {" "}
        </p>
        <p style={{ textAlign: 'justify' }}>
          A través de este registro, podrán recibir información gratuita sobre actividades, herramientas y acciones de orientación y acompañamiento que contribuyan a fortalecer sus capacidades para participar en las compras públicas.
        </p>
        <p>
          {" "}
          <strong>Para ello, te invitamos a completar el siguiente formulario.</strong>

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
