import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const memberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    Breakfast: {
        type: String,
        required: true
    },
    Lunch: {
        type: String,
        required: true
    },
    Dinner: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // Data type for ObjectId
        ref: "User", // Reference to the User model
      },
    medicines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine', // Reference to Medicine model
    }],
});

// Check if the model exists in `models`, else create a new model
const Member = models.Member || model("Member", memberSchema);

export default Member;
