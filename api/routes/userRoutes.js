const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// protected routes
router.use(authController.protect);
router.put(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch("/updateMyPassword", authController.updatePassword);

router.get(
  "/allUsers",
  authController.restrictTo("admin"),
  userController.getAllUsers
);

router.post(
  "/users/create",
  authController.restrictTo("admin"),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.createUser
);

router
  .route("/users/:id")
  .get(authController.restrictTo("admin"), userController.getUserById)
  .put(
    authController.restrictTo("admin"),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  )
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
