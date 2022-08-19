const router = require("express").Router();

const authRoutes = require("./routes");

router.use("/", authRoutes);

module.exports = router;
