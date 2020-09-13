const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./auth-model.js');
const authenticate = require("./authenticate-middleware.js");


router.post('/register', async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "Username is already taken"
      });
    }
    console.log("req.body: ", req.body);

    res.status(201).json(await Users.add(req.body));


  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user || !passwordValid) {
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    }

    req.session.user = user;
    res.json({
      message: `Welcome ${user.username}!`
    });

  } catch (err) {
    next(err);
  }
});

router.get("/logout", authenticate, async (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: "Successfully logged out!"
      });
    }
  });
});


module.exports = router;