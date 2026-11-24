1. Tablas y Vistas principales de Registros
•	taller_ropa_registros: Es la tabla principal donde se almacena la información general de los talleres o empresas registradas (nombre, género, correo, teléfono, estado, razón social, RFC, etc.).
•	taller_ropa_registros_coberturas: Tabla relacional que guarda los estados o entidades federativas en los que el taller ofrece cobertura.
•	taller_ropa_registros_sector: Tabla relacional donde se guardan los sectores a los que pertenece el registro.
•	taller_ropa_registros_tipo_empresa: Tabla relacional que almacena los tipos de empresa seleccionados (por ejemplo: Fabricante, Distribuidor, Comercializadora).
•	taller_ropa_registros_bienes: Tabla relacional que vincula el registro con los bienes y/o servicios ofrecidos (relacionando categorías y familias).
2. Tablas y Vistas de Catálogos
•	cat_claves_entidades: Catálogo de entidades federativas/estados de México (utilizado para obtener los nombres y claves de los estados).
•	cat_talleres_categoria_general: Catálogo de categorías generales para los bienes y servicios.
•	cat_talleres_familia: Catálogo de familias dependientes de las categorías generales de bienes y servicios.
3. Tablas y Vistas de Autenticación / Usuarios
•	view_usuarios_app_perfiles: Una vista de base de datos que se consulta durante el proceso de inicio de sesión (login) para validar el correo, la contraseña cifrada y los perfiles/abreviaturas permitidos.
•	usuarios: Tabla de usuarios del sistema, consultada durante el login para extraer el identificador de restablecimiento de contraseña (idresetpassword) asociado al usuario.
