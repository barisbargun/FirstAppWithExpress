const express = require("express");
const router = express.Router();
const {
    getAllEmployees,
    getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee
} = require("../../controllers/employeesController");


// vscode extension mağazasından thunder client indirilir.
// thunder client'de post, put, delete bölümünden 
// {"id":4} veya {"firstname":"adam", "lastname": "gray"} girilirse response gelecektir.
router.route("/")
    .get(getAllEmployees)
    .post(postEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route("/:id")
.get(getEmployee)

module.exports = router;