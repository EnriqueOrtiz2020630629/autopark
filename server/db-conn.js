const mongoose = require("mongoose");
const dbUrl = process.env.mongoURL;

mongoose
    .connect(dbUrl, { useNewURLParser: true })
    .then(() => console.log("Se conecto a la base de datos exitosamente"))
    .catch(console.error);
