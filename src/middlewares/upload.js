const multer = require('multer');
const storage = require('../config/storage.js');

const upload = multer({
    storage: storage.local.diskStorage, // Adjust the storage configuration based on your needs
    limits: {
        fileSize: storage.local.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
        // Validate the file extension to allow only specific image formats
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileExtension = file.originalname.toLowerCase().match(/\.[^.]+$/)[0];
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file extension'));
        }
    },
});

module.exports = upload;
