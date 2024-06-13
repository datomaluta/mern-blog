const express = require("express");
const postController = require("./../controllers/postController");
const authcontroller = require("./../controllers/authController");
const router = express.Router();

// router.post(
//   "/",
//   postController.uploadPostPhoto,
//   postController.resizePostPhoto,
//   postController.createPost
// );

router.route("/").get(postController.getAllPosts);
router.get("/:slug", postController.getPost);

router.use(authcontroller.protect);

router
  .route("/")
  .post(
    postController.uploadPostPhoto,
    postController.resizePostPhoto,
    postController.createPost
  );

router
  .route("/:id")
  .put(
    postController.uploadPostPhoto,
    postController.resizePostPhoto,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
