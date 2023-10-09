const blogModel = require("../models/blogModel");
const userModel = require("../models/UserModel");
const mongoose = require("mongoose");
//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).json({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).json({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error WHile Getting Blogs",
      error,
    });
  }
};

//Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    //VALIDATION
    if (!title || !description || !image || !user) {
      return res.status(400).json({
        success: false,
        message: "Please Provide ALl Fields",
      });
    }
    // EXISITINGUSER
    const existingUser = await userModel.findById(user);
    //VALIDATION
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "unable to find user",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);

    await existingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();

    return res.status(200).json({
      success: true,
      message: "Blog Created!",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error WHile Creting blog",
      error,
    });
  }
};

//Update Blog
exports.updateBlogController = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const { id } = req.params;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error WHile Updating Blog",
      error,
    });
  }
};

//SIngle Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    //VALIDATION
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog not found with this is",
      });
    }
    return res.status(200).json({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
};

//Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();

    return res.status(200).json({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Can not Delete",
      error,
    });
  }
};

//get USER BLOG
exports.userBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const userBlog = await userModel.findById(id).populate("blogs");
    if (!userBlog) {
      return res.status(400).json({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in user blog",
      error,
    });
  }
};
