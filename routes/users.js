const router = require('express').Router()

router.get("/", (req, res) => {
    res.send("welcome to users page")
})

module.exports = router;
