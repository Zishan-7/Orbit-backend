const router = require("express").Router();
const controller = require("../Controller");
const auth = require("../Middleware/userAuth");

router.post("/login", controller.User.login);
router.post("/register", controller.User.register);
router.post("/logout", auth, controller.User.logout);
router.get("/getProfile", auth, controller.User.getProfile);
router.put("/editProfile", auth, controller.User.editProfile);
router.post("/changePass", auth, controller.User.changePassword);

module.exports = router;
