const express = require("express");
const router = express.Router();
const {
    getAllEmployees,
    getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee
} = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");


// vscode extension mağazasından thunder client indirilir.
// thunder client'de post, put, delete bölümünden 
// {"id":4} veya {"firstname":"adam", "lastname": "gray"} girilirse response gelecektir.

// birden fazla crud operasyonunu ayrı ayrı yazmak yerine .route(path) yazıp geri kalanını ek olarak yazabiliriz.
router.route("/")
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),postEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteEmployee)

router.route("/:id")
.get(getEmployee)

module.exports = router;