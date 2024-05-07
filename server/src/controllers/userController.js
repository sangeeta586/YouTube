import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// user registration fuction
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    // console.log(fullName, email, username, password);
  
    if (!fullName) {
      throw new ApiError(400, "fullName is required");
    }
    if (!email || !email.endsWith("@gmail.com")) {
      throw new ApiError(400, "valid email is required");
    }
    if (!username) {
      throw new ApiError(400, "username is required");
    }
    if (!password || password.length < 6) {
      throw new ApiError(400, "password is required with at least 6 characters");
    }
  
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  
    if (existedUser) {
      throw new ApiError(409, " user already exists");
    }
  
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log('avatarLocalPath',avatarLocalPath)
  
    if (!avatarLocalPath) {
      throw new ApiError(400, "avatar file is required");
    }
  
    const avatar = await  uploadOnCloudinary(avatarLocalPath);
    console.log("avatar",avatar)
  
    if (!avatar || !avatar.url) {
      console.error("Avatar upload failed:", avatar && avatar.error ? avatar.error : "Unknown error");
      throw new ApiError(400, "Avatar upload failed. Please try again.");
    } else {
      console.log("Avatar uploaded successfully:", avatar.url);
    }
  
    let coverImage = null;
    if (req.files && req.files.coverImage) {
      const coverImageLocalPath = req.files.coverImage[0]?.path;
      if (coverImageLocalPath) {
        coverImage = await  uploadOnCloudinary(coverImageLocalPath);
        if (!coverImage || !coverImage.url) {
          console.error("Cover Image upload failed:", coverImage && coverImage.error ? coverImage.error : "Unknown error");
          throw new ApiError(400, "Cover Image upload failed. Please try again.");
        } else {
          console.log("Cover Image uploaded successfully:", coverImage.url);
        }
      }
    }
  
    const user = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      coverImage: coverImage ? coverImage.url : null,
    });
  
    if (!user) {
      throw new ApiError(500, "something went wrong while registering the user");
    }
  
    await res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
  });

export { registerUser };
