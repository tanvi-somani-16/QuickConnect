import User from "../models/user.model.js"
import Message from "../models/message.model.js"

export const getUserforSideBar=async (req,res)=>{
    try {
        const loggedInUser=req.user_id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUser}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in fetching users",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user_id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getmessages controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user_id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendmessage Controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}