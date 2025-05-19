const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require('multer');
const { Readable } = require('stream');
const { Parser } = require("json2csv");
// Initialize the S3 client
const s3Client = new S3Client({
    region: Config.get("AWS").region,
    credentials: {
        accessKeyId: Config.get("AWS").Id,
        secretAccessKey: Config.get("AWS").Key
    }
});
const deleteFileIfExists = async (bucket, key) => {
    try {
        const deleteParams = {
            Bucket: bucket,
            Key: key
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log("Previous image deleted successfully.");
    } catch (err) {
        if (err.name !== 'NoSuchKey') {
            console.log("Error deleting the image:", err.message);
        } else {
            console.log("Image not found, proceeding with upload.");
        }
    }
};
const multerS3Storage = multer.memoryStorage();
const upload = multer({
    storage: multerS3Storage
});
const s3UploadMiddleware = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const bucket = Config.get("AWS").Bucket;
    const key = Date.now() + "-" + req.file.originalname;
    // Delete existing file if it exists
    await deleteFileIfExists(bucket, key);
    const stream = Readable.from(req.file.buffer);
    const uploadParams = {
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: stream,
            ACL: 'public-read'
        }
    };
    const uploader = new Upload(uploadParams);
    try {
         let data = await uploader.done();
        req.file.location = data.Location;
        next();
    } catch (error) {
        console.error("Error uploading file:", error.message);
        next(error);
    }
};
const s3MultiUploadMiddleware = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next();
    }
    const bucket = Config.get("AWS").Bucket;
    const uploadPromises = req.files.map(async file => {
        const key = Date.now() + "-" + file.originalname;
        try {
            // Delete existing file if it exists
            await deleteFileIfExists(bucket, key);
            const stream = Readable.from(file.buffer);
            const uploadParams = {
                client: s3Client,
                params: {
                    Bucket: bucket,
                    Key: key,
                    Body: stream,
                    ACL: 'public-read'
                }
            };
            const uploader = new Upload(uploadParams);
             await uploader.done();
            file = `${process.env.CDN_URL}/${key}`;
            return file;
        } catch (error) {
            console.error("Error uploading file:", error.message);
            return Promise.reject(error);
        }
    });
    try {
        const uploadedFiles = await Promise.all(uploadPromises);
        req.files = uploadedFiles; // Assign uploaded files back to req.files
        next();
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
};

const s3UploadFile = async (buffer, fileName) => {
    const bucket = Config.get("AWS").Bucket;
    const key = `${Date.now()}-${fileName}`;
    const stream = Readable.from(buffer);

    const uploadParams = {
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: stream,
            ACL: 'public-read',
        },
    };

    const uploader = new Upload(uploadParams);
    return await uploader.done();
};
const generateCsv = async (list, fileName) => {
    const header = [];
    list.forEach((document) => {
        let keys = Object.keys(document);
        header.push(keys);
    });
    const fields = header[0];

    const csv = new Parser({ fields });
    const buffer = Buffer.from(csv.parse(list), 'utf-8');

    const uploadRes = await s3UploadFile(buffer, fileName);
    const url = uploadRes.Location;

    return url;
}

const uploadPdfToS3 = async (buffer, originalname) => {
    // const uploadPdfToS3 = async (pdfBuffer, fileName) => {
        try {
            // File details for S3 upload
            // const file = {
            //     originalname: file.fileName || `user_list.pdf`,
            //     buffer: pdfBuffer, // PDF buffer from generated PDF
            //     mimetype: 'application/pdf', // Correct MIME type for PDFs
            // };
    
            // Upload to S3
            const uploadRes = await s3UploadFile(buffer, originalname);
            
            return uploadRes.Location; // Return the S3 URL of the uploaded PDF
        } catch (error) {
            console.error("Error uploading PDF to S3:", error);
            throw new Error("Failed to upload PDF");
        }
};
const uploads = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
          
            callback(null, "multerImages")
        },
        filename: function (req, file, callback) {
            // console.log(file)
            callback(null, file.originalname + "-" + Date.now() + ".jpg")  
        },  
    })
}).single("image")

module.exports = {
    uploads,
    s3UploadMiddleware,
    s3MultiUploadMiddleware,
    generateCsv,
    uploadPdfToS3,
};
