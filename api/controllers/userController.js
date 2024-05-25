const User = require("../models/userModel");
const multer = require("multer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");
const path = require("path"); 
const fs = require("fs");

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

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Ensure the directory exists before saving the file
  const directory = path.join(__dirname, "../public/images");
  // if (!fs.existsSync(directory)) {
  //   fs.mkdirSync(directory, { recursive: true });
  // }

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(directory, req.file.filename));

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword"
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "username", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Upadte user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // console.log(filteredBody);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
