const { check } = require("express-validator"),
  usersRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage("Must be between 5 and 30 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Price must be a number"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid Email")
    .custom(async (email) => {
      // Check if email is already in use
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Your password must be between 4 and 20 characters"),
  //Check if passwords match
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Your password must be between 4 and 20 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      } else {
        return true;
      }
    }),
  requireExistingEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid Email")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("There is no account with that Email");
      }
    }),
  requireValidPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid Password");
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        pasword
      );
      if (!validPassword) {
        throw new Error("Invalid Password");
      }
    }),
};
