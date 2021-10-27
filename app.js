const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const questionRoutes = require("./routes/question");
const quizRoutes = require("./routes/quiz");
const employeeRoutes = require("./routes/employee");
const errorHandler = require("./error/error-handler");

const app = express();
app.use(cors());
app.enable("trust proxy");

app.use(bodyParser.json());

app.use("/question", questionRoutes);
app.use("/quiz", quizRoutes);
app.use("/employee", employeeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
