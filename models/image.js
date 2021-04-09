"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    caption: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    }
}, { timestamps: true });
exports.Image = mongoose_1.model('Image', ImageSchema);
