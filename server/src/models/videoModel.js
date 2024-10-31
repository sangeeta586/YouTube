import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema(
    {
        videoFile:{
            type:String, // clouldinary  url
            required:[true, "video file is required"]
        },

        thumbnail:{
            type:String,
            //required:[true, "thumbnail is required"]
        },
        title:{
            type:String,
            required:[true, "tittle is required"]
        },
        description:{
            type:String,
            required:[true, "description is required"]
        },

        duration:{
            type:Number, // clouldinary
            required:[true, "duration is required"]
        },

        views:{
            type:Number,
            default:0, 
        },
         
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:[true, "owner is required"]
        }


    },{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)    

export const Video = mongoose.model("Video", videoSchema);