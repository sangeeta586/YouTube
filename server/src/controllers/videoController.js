import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videoModel.js"
import {User} from "../models/userModel.js"
//import {Like} from "../models/likes.module.js"
//import {Comment} from "../models/comments.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    const videos = await Video.find()
    if(!videos){
        throw new ApiError(400, "Videos not found")
    }
    res.status(200).json(
        new ApiResponse(
            200,
            videos,
            " All the Videos fetched successfully"
        )
        )
   
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished, thumbnail } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }
    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    // if (!thumbnail) {
    //     throw new ApiError(400, "Thumbnail is required");
    // }
    
    const videoPath = req.files?.videoFile?.[0]?.path;
    
    console.log("local video path " + videoPath);

    if (!videoPath) {
        throw new ApiError(400, "Video file is required");
    }

    const video = await uploadOnCloudinary(videoPath);

    if (!video || !video.url) {
        console.error("Video upload failed:", video && video.error ? video.error : "Unknown error");
        throw new ApiError(400, "Video upload failed. Please try again.");
    } else {
        console.log("Video uploaded successfully: ", video.url);
    }


    try {
        const createdVideo = await Video.create({
            title,
            thumbnail,
            description,
            duration: video.duration, // in seconds
            videoFile: video.url,
            isPublished,
            owner: req.user._id 
        });

        res.status(201).json(
            new ApiResponse(
                201,
                createdVideo,
                "Video created successfully"
            )
        );
    } catch (error) {
        console.error("Error getting video duration:", error);
       
    }
});


// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;
//     if (!videoId) {
//         throw new ApiError(400, "Video ID is required");
//     }

//     // Define the aggregation pipeline for likes
//     const likesPipeline = [
//         {
//             $match: {
//                 "video":new mongoose.Types.ObjectId(videoId)
//             }
//         },
//         {
//             $count: "totalLikes"
//         }
//     ];

//     // Define the aggregation pipeline for comments count
//     const commentsCountPipeline = [
//         {
//             $match: {
//                 "video":new mongoose.Types.ObjectId(videoId)
//             }
//         },
//         {
//             $count: "totalComments"
//         }
//     ];

//     // Define the aggregation pipeline for comments
//     const commentsPipeline = [
//         {
//             $match: {
//                 "video":new mongoose.Types.ObjectId(videoId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "users", // Assuming your user collection is named "users"
//                 localField: "commentBy",
//                 foreignField: "_id",
//                 as: "commenter"
//             }
//         },
//         {
//             $unwind: "$commenter"
//         },
//         {
//             $project: {
//                 _id: 1,
//                 comment: 1,
//                 createdAt: 1,
//                 updatedAt: 1,
//                 "commenter.username": 1,
//                 "commenter.email": 1,
//                 "commenter.fullName": 1,
//                 "commenter.avatar": 1,
//                 "commenter.coverImage": 1
//             }
//         }
//     ];

//     // Perform aggregation for likes
//     const likesResult = await Like.aggregate(likesPipeline);

//     // Perform aggregation for comments count
//     const commentsCountResult = await Comment.aggregate(commentsCountPipeline);

//     // Perform aggregation for comments
//     const commentsResult = await Comment.aggregate(commentsPipeline);

//     // Fetch video details
//     const video = await Video.findById(videoId);

//     if (!video) {
//         throw new ApiError(404, "Video does not exist");
//     }

//     // Construct response object
//     const response = {
//         video,
//         totalLikes: likesResult.length > 0 ? likesResult[0].totalLikes : 0,
//         totalComments: commentsCountResult.length > 0 ? commentsCountResult[0].totalComments : 0,
//         comments: commentsResult
//     };

//     res.status(200).json(
//         new ApiResponse(
//             200,
//             response,
//             "Video details retrieved successfully"
//         )
//     );
// });





const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    console.log(`Video ${videoId}`)
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const { title, description, thumbnail } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (thumbnail) updateFields.thumbnail = thumbnail;

    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true } 
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video details updated successfully"
        )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "Video ID is required");
    }
    // console.log("videoId",videoId)
    const video = await Video.findByIdAndDelete(videoId);

    // console.log("video",video);
    if (!video) {
        throw new ApiError(404, "Video does not exist");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video is deleted successfully"
        ))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "Video ID is required");
    }

   const {isPublished} = req.body

   if(!isPublished){
    throw new ApiError(400, "isPublished is required");
   }
   
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $set: {isPublished} },
        { new: true } 
    );

    if(!video){
        throw new ApiError(404, "Video doesnot exit");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video published/unpublished successfully"
        ))
})




const updateView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log(`Received request to update views for videoId: ${videoId}`);
  
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    console.error(`Invalid Video ID format: ${videoId}`);
    throw new ApiError(400, "Invalid Video ID format");
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      console.error(`Video with ID ${videoId} does not exist`);
      throw new ApiError(404, "Video does not exist");
    }

    console.log(`Successfully updated views for videoId: ${videoId}`);
    res.status(200).json(
      new ApiResponse(
        200,
        video,
        "Video views updated successfully"
      )
    );
  } catch (error) {
    console.error(`Error updating views for videoId: ${videoId}`, error);
    throw new ApiError(500, "Internal Server Error");
  }
});



  

export {
    getAllVideos,
    publishAVideo,
    //getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateView
}