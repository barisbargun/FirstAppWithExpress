const data = {
    users : require("../models/users.json"),
    setUsers : function(users) {this.users = users}
};
// bcrypt şifreyi şifrelemek için kullandığımız kütüphanedir.
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs").promises;

const handleNewUser = async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) return res.status(400).json({"message":"Username and password are required."})
    const duplicate = data.users.find(u => u.username == username);
    // status(409).send("abc") ekrana abc yazdırır
    // status(409).json({"message":"abc"}) ekrana json tipiyle yazdırır
    // sendStatus(409) ekrana 409 kodunun cevabını yazdırır.
    // status(409) tek başına yazılmaz hatadır.

    // eğer databasede aynı username kişisi varsa conflict yani çakışma hatası verir.
    if(duplicate) return res.sendStatus(409) // conflict;
    try{
        // hash ile şifreleriz, 10 sayısı tuzlanma sayısıdır yani çözme süresini uzatır.
        const hashedPsw = await bcrypt.hash(password, 10);
        
        data.setUsers([...data.users, {"username":username, "password":hashedPsw}]);

        await fs.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(data.users)
        );
        res.status(201).json({"message": `New user ${username} created!`})
    } catch(err) {
        res.status(500).json({"message": err.message})
    }
}

module.exports = handleNewUser;