const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createComment = catchAsync(async (req, res, next) => {
  const { userId, postId, content } = req.body;

  // check if userId in body is equal as user id in req.user
  if (userId !== req.user.id) {
    return next(new AppError("You are not allowed to create comment", 403));
  }

  const comment = await Comment.create({
    user: userId,
    post: postId,
    content,
  });

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.getCommentById = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new AppError("No comment found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.getPostComments = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Comment.find({ post: req.params.postId }),
    req.query
  )
    .paginate()
    .sort();

  const comments = await features.query;

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError("No comment found with that id", 404));
  }

  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.likes.push(req.user.id);
    comment.numberOfLikes += 1;
  } else {
    comment.likes.splice(userIndex, 1);
    comment.numberOfLikes -= 1;
  }
  await comment.save();

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.editComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new AppError("No comment found with that id", 404));
  }

  if (comment.use !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not allowed to edit comment", 403));
  }

  const editedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    { new: true, runvalidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      comment: editedComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new AppError("No comment found with that id", 404));
  }

  if (comment?.userId !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not allowed to delete comment", 403));
  }

  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(204).json({ status: "success", data: null });
});

exports.getComments = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You are not allowed to get comments", 403));
  }
  const features = new ApiFeatures(Comment.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;
  const total = await Comment.countDocuments();

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      total,
      comments,
    },
  });
});
