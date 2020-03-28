const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/routes.js");
const mongoose    = require("mongoose");
const cors = require("cors");
const config = require("./config/config");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const noCache = require('nocache')



const app = express();
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs,
  message: "Too many accounts created from this IP, please try again after an hour"
});
 

app.use(helmet());
app.use(noCache());
const corsOptions = {
  origin: 'https://yourdomain.com'
}
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(config.database, { useNewUrlParser: true });
routes(router);
app.use("/api/", limiter);
app.use("/api", router);


// -- routes for docs and generated swagger spec --

app.get("/ping", (req, res) => {
    res.status(200).send("I'm alive");
});

app.get('*', function(req, res) { res.status(404).send({message: 'page not found!'}) });
const server = app.listen(process.env.PORT || 5001, () => {
    console.log("Api RestFull is running on port", server.address().port);
});

module.exports = app;