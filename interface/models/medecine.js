import mongoose from "mongoose"; // Correct import for mongoose
import { type } from "os";
const { Schema, model, models } = mongoose; // Destructure from mongoose

// Define the Medicine Schema
const medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    dosage: {
        type: String,
        required: true
    },
    time: {
        type: [String], // Correct array syntax for an array of strings
        required: true
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    }
});

// Check if the model already exists, otherwise create a new one
const Medicine = models.Medicine || model('Medicine', medicineSchema);

export default Medicine;
