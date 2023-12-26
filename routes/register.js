const router = require("express").Router();

const handleNewUser = require("../controllers/userRegisterController");

router.post("/", handleNewUser)

module.exports = router;