const express = require("express");

const { handleErrors } = require("./middlewares"),
  usersRepo = require("../../repositories/users"),
  signUpTemplate = require("../../views/admin/auth/signup"),
  signInTemplate = require("../../views/admin/auth/signin"),
  {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireExistingEmail,
    requireValidPassword,
  } = require("./validators");
// Subrouter
const router = express.Router();

// Sign Up form
router.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

//Create new user's account
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signUpTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });
    req.session.userId = user.id; // Store user's id inside user's cookie
    res.redirect("/admin/products");
  }
);

// Log out a user
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signed out");
});

// Log in user
router.get("/signin", (req, res) => {
  res.send(signInTemplate({}));
});

// Log in authentication
router.post(
  "/signin",
  [requireExistingEmail, requireValidPassword],
  handleErrors(signInTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

module.exports = router;
