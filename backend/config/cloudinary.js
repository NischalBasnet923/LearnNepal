require("dotenv").config();
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.v2.uploader.upload(file, {resource_type: "auto"});
        return uploadResponse;
    } catch (error) {
        console.error(error);
    }
};

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
        console.error(error);
    }
};

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.v2.uploader.destroy(publicId, {resource_type: "video"});
    } catch (error) {
        console.error(error);
    }
};

module.exports = { uploadMedia, deleteMediaFromCloudinary, deleteVideoFromCloudinary };