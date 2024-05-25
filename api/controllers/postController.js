const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const AppError = require("../utils/appError");
const uuid = require("uuid");
const APIFeatures = require("../utils/apiFeatures");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostPhoto = upload.single("image");

exports.resizePostPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${uuid.v4()}-${Date.now()}.jpeg`;

  // Ensure the directory exists before saving the file
  const directory = path.join(__dirname, "../public/images");
  // if (!fs.existsSync(directory)) {
  //   fs.mkdirSync(directory, { recursive: true });
  // }

  await sharp(req.file.buffer)
    .resize(900, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(directory, req.file.filename));

  next();
});

exports.createPost = catchAsync(async (req, res, next) => {
  // if (!req.file) {
  //   return next(new AppError("Image field is required"));
  // }
  if (req.file) req.body.image = req.file.filename;
  const newPost = await Post.create({ ...req.body, user: req.user.id });

  res.status(201).json({
    status: "success",
    data: {
      tour: newPost,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return next(new AppError("No post found with that slug", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError("No post found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const tour = await Post.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
