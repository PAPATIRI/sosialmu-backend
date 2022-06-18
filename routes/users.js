const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//UPDATE USER DATA
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // check if user want update password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(403).json(err);
      }
    }

    //update the account data
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(403).json(err);
    }
  } else {
    return res.status(403).json("you can only update your account");
  }
});

//DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //update the account data
    try {
      const user = await User.deleteOne(
        { _id: req.params.id },
        {
          $set: req.body,
        }
      );
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(403).json(err);
    }
  } else {
    return res.status(403).json("you can only delete your account");
  }
});
//get a user
//follow a user
//unfollow user
router.get("/", (req, res) => {
  res.send("welcome to users page");
});

module.exports = router;
