const express = require("express");
const router = express.Router();
const path = require("path");

// router.get() ve app.get() farkı şudur:
// eğer ki tüm projedeki yönlendirmeleri kontrol etmek istiyorsak
// app.get() kullanırız, eğer ki yönlendirmeleri parçalamak istiyorsak root kullanmalıyız.
// örneğin /subdir/ yönlendirmesine giren birisi aşağıdaki pathleride yazdığı takdirde istenilen siteye yönlendirilecektir.
 
router.get("^/$|^/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, ".." , "views/subdir", "index.html"))
})

router.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, ".." , "views/subdir", "test.html"))
})

module.exports = router; 