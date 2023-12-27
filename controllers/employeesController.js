const fsPromises = require('fs').promises;
const path = require("path");
const Employee = require('../models/Employee');
const modelPath = path.join(__dirname, "..", "models", "employees.json");
const db = {
    employees: require(modelPath),
    setEmployees: function (data) { this.employees = data; }
}

const saveFile = async () => {

    await fsPromises.writeFile(modelPath, JSON.stringify(db.employees));
}

const getAllEmployees = async (req, res) => {
    // res.json() ekrana json db.employees json tipinde yazdırır.
    // res.json(db.employees)

    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees in data' });
    res.json(employees);
}

const postEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are included.' });
    }
    try {
        const result = await Employee.create({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }

    // const newEmployee = {
    //     "id": id = db?.employees?.length > 0 ? db.employees[db.employees.length - 1].id + 1 : 1,
    //     "firstname": req.body.firstname,
    //     "lastname": req.body.lastname
    // };
    // if (!newEmployee.firstname || !newEmployee.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are included.' });
    // }
    // db.setEmployees([...db.employees, newEmployee]);
    // saveFile();
    // res.sendStatus(200);
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ 'message': 'You must enter a valid ID' });

    if (!req.body.firstname && !req.body.lastname)
        return res.status(400).json({ 'message': 'You must enter either firstname or lastname' });

    try {
        const employee = await Employee.findById(req.body.id).exec();
        if (!employee) return res.status(204).json({ 'message': 'You must ented a valid employee ID' });

        if (req.body.firstname) employee.firstname = req.body.firstname;
        if (req.body.lastname) employee.lastname = req.body.lastname;

        await employee.save();
        res.status(200).json({ 'message': 'Updated user' });
    } catch (err) {
        res.status(500).json({"message":err.message});
    }



    // let havingID = false;
    // db?.employees?.map(e => {
    //     if (e.id == req.body.id) {
    //         e.firstname = req.body.firstname
    //         e.lastname = req.body.lastname
    //         havingID = true;
    //     }
    // })
    // if(!havingID)
    //     return res.status(400).json({'message':'Couldn\'t find'});
    // db.setEmployees(db.employees)
    // saveFile();
    // res.sendStatus(200);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ 'message': 'You must enter a valid ID' });

    try {
        const employee = await Employee.findById(req.body.id).exec();
        await employee.deleteOne().then(e => res.status(200).json({ 'message': 'Deleted.' })).catch(e => res.status(500).send(e));
    } catch (error) {
        res.status(400).json({ 'message': 'You must ented a valid employee ID' });
    }
    
    // const employee = db?.employees?.find(v => v.id == parseInt(req?.body?.id || -1));

    // if (employee) {
    //     const filterEmployees = db?.employees?.filter(v => v.id != parseInt(req?.body?.id));
    //     db.setEmployees(filterEmployees);
    //     saveFile();
    //     res.sendStatus(200);
    // } else {
    //     return res.status(400).json({ 'Message': 'Check your id' });
    // }



}

const getEmployee = async (req, res) => {
    // const employee = db.employees.find(e => e.id == parseInt(req.params.id))
    // if (!employee) return res.status(400).json({ 'Message': 'ID is wrong' });
    // res.json(employee);
    if (!req?.params?.id) return res.status(400).json({ 'Message': 'You must enter a valid ID' });
    try {
        const employee = await Employee.findById(req.params.id)
        res.json(employee);
    } catch {
        res.status(400).json({ 'Message': 'Employee not found with the provided ID' });
    }



}


module.exports = {
    getAllEmployees,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}