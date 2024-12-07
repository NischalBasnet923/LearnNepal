const express = require("express");
const router = express.Router();
const authenticationController = require("../controller/authenticationController");

// authentication routes
router.post("/register", authenticationController.register);
router.post("/login", authenticationController.signIn);
router.post("/logout", authenticationController.logout);
router.get("/verifytoken", authenticationController.verifyToken);

module.exports = router;
