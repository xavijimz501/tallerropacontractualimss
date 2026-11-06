const express = require("express");
const cors = require("cors");

const registroRoutes = require("./routes/registro.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tallerropacontractualimss/api", registroRoutes);

module.exports = app;