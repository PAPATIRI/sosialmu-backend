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

//GET A USER DATA
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
  //check id user is not current user id
  if (req.body.userId !== req.params.id) {
    try {
      //looking for id of user and currentuser
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //check if current user has not followed the user
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("your already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

//UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  //check id user is not current user id
  if (req.body.userId !== req.params.id) {
    try {
      //looking for id of user and currentuser
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //check if current user has been followed the user
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("your don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't unfollow yourself");
  }
});

router.get("/", (req, res) => {
  res.send("welcome to users page");
});

module.exports = router;
