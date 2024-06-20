const mongoose = require("mongoose");
const slugify = require("slugify");
const shortid = require("shortid");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Title field is required"],
    },
    category: {
      type: String,
      required: [true, "Category field is required"],
    },
    content: {
      type: String,
      required: [true, "Content field is required"],
    },
    image: {
      type: String,
      required: [true, "Image field is required"],
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  let slug = slugify(this.title, { lower: true });
  const existingSlug = await mongoose.models.Post.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${shortid.generate()}`;
  }
  this.slug = slug;
  next();
});

postSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true });
  }
  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate("user");
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
