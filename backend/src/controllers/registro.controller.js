const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const obtenerRegistros = async (req, res) => {
  try {
    const [rows] = await pool.query(`
  SELECT
    r.id,
    r.nombre,
    r.genero,
    r.correo,
    r.telefono,
    r.nombre_representante,
    r.telefono_representante,
    r.correo_representante,
    r.venta_gobierno,

    ce_estado.entidad_federativa AS estado,

    r.nombre_comercial,
    r.razon_social,
    r.rfc,
    r.tamanio_empresa,
    r.numero_empleados,

    (
      SELECT GROUP_CONCAT(
        ce.entidad_federativa
        SEPARATOR ', '
      )
      FROM taller_ropa_registros_coberturas c
      INNER JOIN cat_claves_entidades ce
        ON ce.id_entidad = c.id_estado
      WHERE c.id_taller = r.id
    ) AS cobertura,

    (
      SELECT GROUP_CONCAT(
        te.tipo_empresa
        SEPARATOR ', '
      )
      FROM taller_ropa_registros_tipo_empresa te
      WHERE te.id_taller = r.id
    ) AS tipo_empresa,

    (
      SELECT GROUP_CONCAT(DISTINCT te.descripcion SEPARATOR ', ')
      FROM taller_ropa_registros_tipo_empresa te
      WHERE te.id_taller = r.id
    ) AS descripcion,

    (
      SELECT GROUP_CONCAT(
        CONCAT(
          cg.nombre,
          ' - ',
          f.nombre
        )
        SEPARATOR ', '
      )
      FROM taller_ropa_registros_bienes b
      INNER JOIN cat_talleres_categoria_general cg
        ON cg.id = b.id_cat_general
      INNER JOIN cat_talleres_familia f
        ON f.id = b.id_familia
      WHERE b.id_taller = r.id
    ) AS bienes_servicios,

    r.fecha_registro

  FROM taller_ropa_registros r

  INNER JOIN cat_claves_entidades ce_estado
    ON ce_estado.id_entidad = r.estado

  ORDER BY r.id DESC
`);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener registros:", error);

    res.status(500).json({
      message: "Error al obtener registros",
    });
  }
};

const obtenerEstadosCat = async (req, res) => {
  try {
    const [rows] = await pool.query(
      ` SELECT id_entidad, entidad_federativa
        FROM cat_claves_entidades
        WHERE entidad_federativa <> 'No identificado'
        ORDER BY entidad_federativa ASC `,
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener catálogo de estados:", error);
    res.status(500).json({ message: "Error al obtener catálogo de estados" });
  }
};

const crearRegistro = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      nombre,
      genero,
      correo,
      coberturas,
      telefono,
      nombre_representante,
      telefono_representante,
      correo_representante,
      venta_gobierno,
      descripcion,
      estado,
      nombre_comercial,
      numero_empleados,
      razon_social,
      rfc,
      tamanio_empresa,
      sectores,
      tipo_empresa,
      bienes_servicios,
    } = req.body;

    // ==========================================
    // 1. Validar correo existente
    // ==========================================

    const [correoExistente] = await connection.query(
      `
      SELECT id
      FROM taller_ropa_registros
      WHERE correo = ?
      LIMIT 1
      `,
      [correo.trim()],
    );

    if (correoExistente.length > 0) {
      return res.status(409).json({
        message: "El correo electrónico ya se encuentra registrado.",
      });
    }

    const [correoRepresentanteExistente] = await connection.query(
      `
      SELECT id
      FROM taller_ropa_registros
      WHERE correo_representante = ?
      LIMIT 1
      `,
      [correo_representante.trim()],
    );

    if (correoRepresentanteExistente.length > 0) {
      return res.status(409).json({
        message: "El correo del representante ya se encuentra registrado.",
      });
    }

    // ==========================================
    // 2. Iniciar transacción
    // ==========================================

    await connection.beginTransaction();

    // ==========================================
    // 3. Insertar registro principal
    // ==========================================

    const [result] = await connection.query(
      `
      INSERT INTO taller_ropa_registros (
        nombre,
        genero,
        correo,
        telefono,
        nombre_representante,
        telefono_representante,
        correo_representante,
        venta_gobierno,
        estado,
        nombre_comercial,
        numero_empleados,
        razon_social,
        rfc,
        tamanio_empresa
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        genero,
        correo,
        telefono,
        nombre_representante,
        telefono_representante,
        correo_representante,
        venta_gobierno,
        estado,
        nombre_comercial,
        numero_empleados,
        razon_social,
        rfc,
        tamanio_empresa,
      ],
    );

    const idTaller = result.insertId;

    if (Array.isArray(coberturas) && coberturas.length > 0) {
      const valoresCoberturas = coberturas.map((cobertura) => [
        idTaller,
        cobertura,
      ]);

      await connection.query(
        `INSERT INTO taller_ropa_registros_coberturas (
          id_taller,
          id_estado
        )
        VALUES ?`,
        [valoresCoberturas],
      );
    }

    // ==========================================
    // 4. Insertar sectores
    // ==========================================

    if (Array.isArray(sectores) && sectores.length > 0) {
      const valoresSectores = sectores.map((sector) => [idTaller, sector]);

      await connection.query(
        `
        INSERT INTO taller_ropa_registros_sector (
          id_taller,
          sector
        )
        VALUES ?
        `,
        [valoresSectores],
      );
    }

    // ==========================================
    // 5. Insertar tipos de empresa
    // ==========================================

    if (Array.isArray(tipo_empresa) && tipo_empresa.length > 0) {
      const valoresTiposEmpresa = tipo_empresa.map((tipo) => [idTaller, tipo, descripcion]);

      await connection.query(
        `
        INSERT INTO taller_ropa_registros_tipo_empresa (
          id_taller,
          tipo_empresa,
          descripcion
        )
        VALUES ?
        `,
        [valoresTiposEmpresa],
      );
    }

    // ==========================================
    // 6. Insertar bienes y/o servicios
    // ==========================================

    if (Array.isArray(bienes_servicios) && bienes_servicios.length > 0) {
      const valoresBienes = bienes_servicios.map((item) => [
        idTaller,
        item.id_cat_general,
        item.id_familia,
      ]);

      await connection.query(
        `
        INSERT INTO taller_ropa_registros_bienes (
          id_taller,
          id_cat_general,
          id_familia
        )
        VALUES ?
        `,
        [valoresBienes],
      );
    }

    // ==========================================
    // 7. Confirmar todo
    // ==========================================

    await connection.commit();

    res.status(201).json({
      message: "Registro creado correctamente",
      id: idTaller,
    });
  } catch (error) {
    // ==========================================
    // 8. Si algo falla, deshacer todo
    // ==========================================

    await connection.rollback();

    console.error("Error al crear registro:", error);

    res.status(500).json({
      message: "Error al crear registro",
    });
  } finally {
    connection.release();
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios",
      });
    }

    const [rows] = await pool.query(
      `
        SELECT *
        FROM view_usuarios_app_perfiles
        WHERE abreviatura = ?
          AND correo = ?
        LIMIT 1
      `,
      ["tallerropacontractualimss", correo],
    );

    const users = rows;

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = users[0];

    if (user.abreviatura !== "tallerropacontractualimss") {
      return res.status(401).json({
        success: false,
        message: "Acceso no autorizado para este perfil",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const [perfilRows] = await pool.query(
      `
        SELECT idresetpassword
        FROM usuarios
        WHERE idusuario = ?
      `,
      [user.idusuario],
    );

    const idresetpassword = perfilRows[0]?.idresetpassword;

    const token = jwt.sign(
      {
        idusuario: user.idusuario,
        idresetpassword,
        perfilnombre: user.perfilnombre,
      },
      process.env.JWT_SECRET || "secret_key",
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);

    return res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

//catalogos
const obtenerCategoriasGenerales = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        nombre
      FROM cat_talleres_categoria_general
      WHERE activo = 1
      ORDER BY nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener categorías generales:", error);

    res.status(500).json({
      message: "Error al obtener categorías generales",
    });
  }
};

const obtenerFamilias = async (req, res) => {
  try {
    const { id_cat_general } = req.query;

    if (!id_cat_general) {
      return res.status(400).json({
        message: "El id de la categoría general es obligatorio",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        id_cat_general,
        nombre
      FROM cat_talleres_familia
      WHERE id_cat_general = ?
        AND activo = 1
      ORDER BY nombre ASC
      `,
      [id_cat_general],
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener familias:", error);

    res.status(500).json({
      message: "Error al obtener familias",
    });
  }
};

module.exports = {
  obtenerRegistros,
  crearRegistro,
  obtenerEstadosCat,
  login,
  obtenerCategoriasGenerales,
  obtenerFamilias,
};
