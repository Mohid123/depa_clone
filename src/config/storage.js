const multer = require('multer');
const fs = require('fs');

const localDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = `uploads/images`;
        // Check if the destination directory exists, create it if it doesn't
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        cb(null, destinationPath);
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
