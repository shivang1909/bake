import AdminModel from "../models/Admin.model.js";

export const admin = async (request, response, next) => {
    try {
        const userId = request.userId;

        const user = await AdminModel.findById(userId);

        // Allow access for both "Admin" and "Inventory Manager"
        if (user.role !== 'Admin' && user.role !== 'Inventory Manager') {
            return response.status(403).json({
                message: "Permission denied. No admin or inventory manager access",
                error: true,
                success: false
            });
        }

        next();

    } catch (error) {
        return response.status(500).json({
            message: "Permission denial catch",
            error: true,
            success: false
        });
    }
};
