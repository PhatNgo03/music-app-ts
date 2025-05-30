"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const uploadToCloudinary_1 = __importDefault(require("../../helpers/uploadToCloudinary"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
const upload = (req, res, next) => {
    const file = req.file;
    if (!file || !file.buffer || !file.fieldname)
        return next();
    const streamUpload = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream);
        });
    };
    function uploadFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                console.error('File is undefined');
                return res.status(400).json({ message: 'No file provided' });
            }
            try {
                const result = yield streamUpload();
                req.body[file.fieldname] = result.url;
                next();
            }
            catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({ message: 'Upload failed' });
            }
        });
    }
    uploadFile();
};
exports.upload = upload;
const uploadFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (files && typeof files === "object" && !Array.isArray(files)) {
        for (const key in files) {
            req.body[key] = [];
            const array = files[key];
            for (const item of array) {
                try {
                    const result = yield (0, uploadToCloudinary_1.default)(item.buffer, item.mimetype);
                    req.body[key].push(result);
                }
                catch (error) {
                    console.log("Upload error:", error);
                }
            }
        }
    }
    next();
});
exports.uploadFields = uploadFields;
