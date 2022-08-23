const router = require("express").Router();
const controller = require("../Controller");
const auth = require("../Middleware/adminAuth");

router.post("/login", controller.Admin.login);
router.post("/register", controller.Admin.register);
router.post("/logout", auth, controller.Admin.logout);
router.get("/getProfile", auth, controller.Admin.getProfile);
router.put("/editProfile", auth, controller.Admin.editProfile);
router.post("/changePass", auth, controller.Admin.changePassword);

//vendors

router.get("/vendors", auth, controller.Admin.getVendors);
router.post("/vendors", auth, controller.Admin.addVendor);
router.put("/vendors/:id", auth, controller.Admin.editVendor);
router.delete("/vendors", auth, controller.Admin.deleteVendor);

//services

router.get("/services", auth, controller.Admin.getServices);
router.post("/services", auth, controller.Admin.addService);
router.put("/services/:id", auth, controller.Admin.editService);
router.delete("/services", auth, controller.Admin.deleteService);

// promo codes

router.get("/promoCode", auth, controller.Admin.getPromoCodes);
router.post("/promoCode", auth, controller.Admin.addPromoCode);
router.put("/promoCode/:id", auth, controller.Admin.editPromoCode);
router.delete("/promoCode", auth, controller.Admin.deletePromoCode);

// Users

router.get("/user", auth, controller.Admin.getUsers);
router.post("/user", auth, controller.Admin.addUser);
router.put("/user/:id", auth, controller.Admin.editUser);
router.delete("/user", auth, controller.Admin.deleteUser);

module.exports = router;
