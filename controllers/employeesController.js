const data = {
    employees: require("../models/employees.json"),
    setEmployees: function (data) { this.employees = data; }
}

const getAllEmployees = (req, res) => {
    // res.json() ekrana json data.employees json tipinde yazdırır.
    res.json(data.employees)
}

const postEmployee = (req, res) => {
    const newEmployee = {
        "id": id = data?.employees?.length > 0 ? data.employees[data.employees.length - 1].id + 1 : 1,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname
    };
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last names are included.' });
    }
    data.setEmployees([...data.employees, newEmployee]);
    res.json(data.employees)
}

const updateEmployee = (req, res) => {
    let havingID = false;
    data?.employees?.map(e => {
        if (e.id == req.body.id) {
            e.firstname = req.body.firstname
            e.lastname = req.body.lastname
            havingID = true;
        }
    })
    if(!havingID)
        return res.status(400).json({'message':'Couldn\'t find'});
    res.json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data?.employees?.find(v => v.id == parseInt(req?.body?.id || -1));

    if (employee) {
        const filterEmployees = data?.employees?.filter(v => v.id != parseInt(req?.body?.id));
        data.setEmployees(filterEmployees);
        res.json(data.employees);
    } else {
        return res.status(400).json({'Message': 'Check your id'});
    }



}

const getEmployee = (req, res) => {
    const employee = data.employees.find(e => e.id == parseInt(req.params.id))
    if (!employee) return res.status(400).json({'Message': 'ID is wrong'});
    res.json(employee);
}


module.exports = {
    getAllEmployees,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}