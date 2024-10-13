// import TryCatch from "../middlewares/TryCatch.js";
// import { Courses } from "../models/Courses.js";
// import {Lecture} from "../models/Lecture.js";
// import { User } from "../models/User.js";


// //  export const getAllCourses = TryCatch(async(req,res)=>{
// //     const courses = await Courses.find();
// //       res.json({
// //         courses,
// //       });
// // });


// export const getAllCourses = TryCatch(async (req, res) => {
//   const courses = await Courses.find();

//   if (courses.length === 0) {
//       return res.status(404).json({
//           success: false,
//           message: "No courses found",
//       });
//   }

//   res.status(200).json({
//       success: true,
//       count: courses.length,
//       courses,
//   });
// });



// export const getSingleCourse = TryCatch(async(req,res)=>{
//     const course = await Courses.findById(req.params.id);

//     res.json({
//         course,
//     });
// });

// export const fetchLectures = TryCatch(async (req,res)=>{
//    const lectures = await Lecture.find({course:req.params.id});

//    const user = await User.findById(req.user._id);

//    if(user.role === "admin"){
//     return res.json({lectures});
//    }

//    if(!user.subscription.includes(req.params.id))
//          return res.status(400).json({
//           message:"You have not Subscribed to this course",
//         });
//         res.json({ lectures });
// });


// export const fetchLecture = TryCatch(async (req,res)=>{
//   const lecture = await Lecture.findById(req.params.id);

//   const user = await User.findById(req.user._id);

//   if(user.role === "admin"){
//    return res.json({lecture});
//   }

//   if(!user.subscription.includes(lecture.course))
//         return res.status(400).json({
//          message:"You have not Subscribed to this course",
//        });
//        res.json({ lecture });
// });

// export const getMyCourses = TryCatch(async(req,res)=>{
//   const courses = await Courses.find({_id:req.user.subscription});

//   res.json({
//       courses,
//   });
// });




import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";


export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin" && user.role === "user") {
    return res.json({ lectures });
  }

  // if (!user.subscription.includes(req.params.id))
  //   return res.status(400).json({
  //     message: "You have not subscribed to this course",
  //   });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin" && user.role !== "admin") {
    return res.json({ lecture });
  }

  // if (!user.subscription.includes(lecture.course))
  //   return res.status(400).json({
  //     message: "You have not subscribed to this course",
  //   });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }
});
  



  

    