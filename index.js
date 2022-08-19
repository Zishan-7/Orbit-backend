const express = require("express");
const app = express();
require("dotenv").config();
const http = require("http");
const server = http.createServer(app);
const userRoutes = require("./UserRoutes/index");
const adminRoutes = require("./AdminRoutes/index");
const port = process.env.PORT || 3001;
const db = require("./Common/connection");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

server.listen(port, () => {
  db.connect();
  console.log(`Server running on port no : ${port}`);
});
