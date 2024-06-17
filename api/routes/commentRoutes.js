const express = require("express");
const commentController = require("./../controllers/commentController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/", authController.protect, commentController.createComment);
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  commentController.getComments
);
router.put(
  "/:commentId",
  authController.protect,
  commentController.editComment
);
router.put(
  "/likeComment/:commentId",
  authController.protect,
  commentController.likeComment
);
router.delete(
  "/:commentId",
  authController.protect,
  commentController.deleteComment
);

router.get("/getPostComments/:postId", commentController.getPostComments);

router.get(
  "/:commentId",
  authController.protect,
  commentController.getCommentById
);

module.exports = router;
