import TryCatch from "../middlewares/TryCatch.js";
import {Courses} from "../models/Courses.js";
import {Lecture} from "../models/Lecture.js";
import {rm} from "fs";
import {promisify} from "util";
import fs from "fs";
import {User} from "../models/User.js";
//import { TryCatch } from './middleware'; 



export const createCourse = TryCatch(async(req,res)=>{
    const {title,description,category,createdBy,duration,price} = req.body;

    const image = req.file;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image:image?.path,
        duration,
        price,
    });

    res.status(201).json({
        message:"Course Created SuccessFull....",
    });s
});


export const addLectures = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

    if(!course) return res.status(404).json({
        message:"No Course with this id",
    });
    const {title,description} = req.body;

    const file = req.file;

    const lecture = await Lecture.create({
        title,
        description,
        video:file?.path,
        course:course._id,
    });

    res.status(201).json({
        message:"Lecture Added",
        lecture,
    });
});




export const deleteLecture = TryCatch(async (req, res) => {
    // Get the lecture ID from the request parameters
    const lecture = await Lecture.findById(req.params.id);

    // Check if the lecture exists
    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }

    // Log the video path for debugging
    console.log("Lecture Video Path:", lecture.video);

    // Validate the video path
    if (typeof lecture.video === 'string' && lecture.video.trim() !== '') {
        rm(lecture.video, (err) => {
            if (err) {
                console.error(`Error deleting video: ${err.message}`);
                return res.status(500).json({ message: "Failed to delete video" });
            } else {
                console.log("Video deleted successfully");
            }
        });
    } else {
        console.error("Video path is invalid or empty");
        return res.status(400).json({ message: "Video path is invalid" });
    }

    // Delete the lecture from the database
    await lecture.deleteOne();
    return res.json({ message: "Lecture deleted successfully" });
});




// export const deleteLecture = TryCatch(async(req,res)=>{
//     const lecture = await Lecture.findById(req.params.id);

//     rm(lecture.video,()=>{
//         console.log("Video deleted");
//     });
//     await lecture.deleteOne();

//     res.json({message:"Lecture Deleted"});
// });




const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    // Check if the course exists
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const lectures = await Lecture.find({ course: course._id });

    // Delete all lecture videos
    await Promise.all(
        lectures.map(async (lecture) => {
            if (typeof lecture.video === 'string' && lecture.video.trim() !== '') {
                try {
                    await unlinkAsync(lecture.video);
                    console.log("Video Deleted");
                } catch (err) {
                    console.error(`Error deleting video: ${err.message}`);
                }
            } else {
                console.error("Invalid or empty video path:", lecture.video);
            }
        })
    );

    // Validate and delete course image
    if (typeof course.image === 'string' && course.image.trim() !== '') {
        fs.rm(course.image, (err) => {
            if (err) {
                console.error(`Error deleting image: ${err.message}`);
            } else {
                console.log("Image Deleted");
            }
        });
    } else {
        console.error("Invalid or empty image path:", course.image);
    }

    // Delete all lectures associated with the course
    await Lecture.deleteMany({ course: req.params.id });

    // Delete the course itself
    await course.deleteOne();

    // Remove the course from user subscriptions
    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    res.json({
        message: "Course Deleted",
    });
});



// const unlinkAsync = promisify(fs.unlink);

// export const deleteCourse = TryCatch(async(req,res)=>{
//     const course = await Courses.findById(req.params.id);

//     const lectures = await Lecture.find({course:course._id});

//    await Promise.all(
//     lectures.map(async(lecture)=>{
//         await unlinkAsync(lecture.video);
//         console.log("Video Deleted");    
//     })
//    );
//    rm(course.image,()=>{
//     console.log("Image Deleted");
//    });

//    await Lecture.find({course:req.params.id}).deleteMany();

//    await course.deleteOne();
//    await User.updateMany({},{$pull:{subscription:req.params.id}}); 
//    res.json({
//     message:"Course Deleted",
//    });
// });

export const getAllStats = TryCatch(async(req,res)=>{
    const totalCourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
        totalCourses,
        totalLectures,
        totalUsers,
    };
    res.json({
        stats,
    });
});



export const getAllUsers = TryCatch(async(req,res)=>{
    const users = await User.find({_id:{$ne:req.user._id}}).select("-password");
     
    res.json({users});
});

export const updateRole = TryCatch(async(req,res)=>{
    // if(req.user.mainrole!== "superadmin") return res.status(403).json({
    //     message:"This endpoint is assign to superadmin", 
    // });

    const user = await User.findById(req.params.id);

    if(user.role === "user"){
        user.role = "admin";
        await user.save();

        return res.status(200).json({
            message:"Role updated to admin",
        });
    }

    
    if(user.role === "admin"){
        user.role = "user";
        await user.save();

        return res.status(200).json({
            message:"Role updated",
        });
    }
});