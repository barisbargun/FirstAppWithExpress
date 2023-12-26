const express = require("express");
const router = express.Router();
const path = require("path");

// ^ ifadesi işaretle başlamak zorunda ("/")
// $ ifadesi işaretle bitmek zorunda ("/")
// ^| ifadesi ise veya demektir.
// (.html)? sonu bu şekilde biterse de kabul et anlamında
// "^/$|index" ifadesi bir tek "", "/", "index" adreslerine gider.
router.get("^/$|^/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname,"..", "views", "index.html"))
})

router.get("/add(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "new-page.html"))
})

// 302 ifadesi ile 301 ifadesinin farkı
// 301 ifadesi browserın dnssine kalıcı olarak kaydeder
// ancak önbelleği temizlersek başka adrese gidebiliriz.
router.get("/old-page(.html)?", (req, res) => {
    res.redirect(302, "/")
})

module.exports = router;