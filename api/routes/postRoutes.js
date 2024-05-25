const express = require("express");
const postController = require("./../controllers/postController");
const authcontroller = require("./../controllers/authController");
const router = express.Router();

router.use(authcontroller.protect);

// router.post(
//   "/",
//   postController.uploadPostPhoto,
//   postController.resizePostPhoto,
//   postController.createPost
// );

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    postController.uploadPostPhoto,
    postController.resizePostPhoto,
    postController.createPost
  );

router.get("/:slug", postController.getPost);

router
  .route("/:id")
  .put(
    postController.uploadPostPhoto,
    postController.resizePostPhoto,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
