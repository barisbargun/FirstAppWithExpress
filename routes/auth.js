const router = require("express").Router();

const handleUserAuth = require("../controllers/userAuthController");

router.post("/", handleUserAuth)

module.exports = router;