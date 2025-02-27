import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: {
        type: Number,
        default: null
    },
    avatar: {
        type: String,
        default: ""
    },
    role: { type: String, required: true },
    password: { type: String }, // Optional for initial creation
    isPasswordSet: { type: Boolean, default: false }, // New field
}, { timestamps: true });

// Prevent model redefinition
// const AdminModel = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
