const multer = require('multer');

const localDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Adjust the destination folder as per your requirements
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = file.originalname.substring(file.originalname.lastIndexOf("."));
        const fileName = `${timestamp}${extension}`;
        cb(null, fileName);
    },
});

module.exports = {
    local: {
        diskUrl: 'uploads/images', // Adjust the URL to access the stored images
        diskStorage: localDiskStorage,
        maxFileSize: 2 * 1024 * 1024, // Maximum file size in bytes (2MB in this example)
    },
    // Add other storage configurations if needed (e.g., AWS S3)
};
