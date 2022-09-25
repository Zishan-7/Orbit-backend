const router = require("express").Router();
const controller = require("../Controller");
const auth = require("../Middleware/userAuth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", controller.Admin.login);
router.post("/register", controller.Admin.register);
router.post("/logout", auth, controller.Admin.logout);
router.get("/getProfile", auth, controller.Admin.getProfile);
router.put("/editProfile", auth, controller.Admin.editProfile);
router.post("/changePass", auth, controller.Admin.changePassword);
router.post("/resetPassword", controller.Admin.resetPassword);

//vendors

router.post("/vendors", auth, controller.Admin.getVendors);
router.post("/addVendors", auth, controller.Admin.addVendor);
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
router.get("/promoCode/:id", auth, controller.Admin.getSinglePromoCode);
router.put("/promoCode/:id", auth, controller.Admin.editPromoCode);
router.delete("/promoCode", auth, controller.Admin.deletePromoCode);

// Users

router.post("/user", auth, controller.Admin.getUsers);
router.post("/addUser", auth, controller.Admin.addUser);
router.put("/user/:id", auth, controller.Admin.editUser);
router.delete("/user", auth, controller.Admin.deleteUser);

// MasterListing

router.post("/masterListing", auth, controller.Admin.getMasterListing);
router.post("/addMasterListing", auth, controller.Admin.addMasterListing);
router.put("/masterListing/:id", auth, controller.Admin.editMasterListing);
router.delete("/masterListing", auth, controller.Admin.deleteMasterListing);
router.post("/filteredCompanies", auth, controller.User.fetchFilteredCompanies);

// Orders

router.get("/order", auth, controller.Admin.getOrders);
router.post("/order", auth, controller.Admin.placeOrder);
router.put("/order/:id", auth, controller.Admin.editOrder);
router.delete("/order", auth, controller.Admin.deleteOrder);
router.post("/newOrder", auth, controller.Admin.getNewOrders);
router.post("/userOrder", auth, controller.Admin.getUsersOrders);
router.post("/clientSales", auth, controller.Admin.getClientSales);
router.post("/vendorSales", auth, controller.Admin.getVendorSales);
router.put("/changeOrderStatus/:id", auth, controller.Admin.changeOrderStatus);

//Admin Fee

router.get("/adminFee", auth, controller.Admin.getAdminFee);
router.post("/adminFee", auth, controller.Admin.addAdminFee);
router.put("/adminFee/:id", auth, controller.Admin.editAdminFee);

// chat

router.post("/chat", auth, controller.Admin.accessChat);
router.get("/chat", auth, controller.Admin.fetchChats);
router.get("/chat/:chatId", auth, controller.Admin.getAllMessages);
router.post("/chat/sendMessage", auth, controller.Admin.sendMessage);
router.get("/dashboard", auth, controller.Admin.dashboard);
router.get("/admins", auth, controller.Admin.admins);

// notifications

router.post("/notification", auth, controller.Admin.sendNotification);
router.post("/getNotification", auth, controller.Admin.getNotifications);

//file Upload

router.post("/uploadFile", upload.single("file"), controller.Admin.uploadFile);

module.exports = router;
