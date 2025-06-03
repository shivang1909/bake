import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js"; 

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId; // from auth middleware

    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      mobile,
    } = request.body;

    // Create address without userId now
    const createAddress = new AddressModel({
      name,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      mobile,
    });

    const saveAddress = await createAddress.save();

    // Add address ID to user document
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    return response.json({
      message: "Address Created Successfully",
      error: false,
      success: true,
      data: saveAddress,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAddressController = async (request, response) => {
    try {
        const userId = request.userId;

        // Get the user and populate address_details
        const user = await UserModel.findById(userId).populate({
            path: "address_details",
            match: { status: true }, // Only get addresses where status is true
            options: { sort: { createdAt: -1 } }
        });

        // If user not found
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return response.json({
            data: user.address_details,
            message: "List of active addresses",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const updateAddressController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id, address_line1, address_line2, name, city, state, country, pincode, mobile } = request.body;

        // Step 1: Check if the address belongs to the user
        const user = await UserModel.findOne({ _id: userId, address_details: _id });

        if (!user) {
            return response.status(403).json({
                message: "Address not associated with the user",
                error: true,
                success: false
            });
        }

        // Step 2: Update the address
        const updateAddress = await AddressModel.findByIdAndUpdate(
            _id,
            {
                address_line1,
                address_line2,
                name,
                city,
                state,
                country,
                pincode,
                mobile
            },
            { new: true }
        );

        return response.json({
            message: "Address Updated",
            error: false,
            success: true,
            data: updateAddress
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteAddressController = async (request, response) => {
  try {
    const userId = request.userId; // from auth middleware
    const { _id } = request.body;


    if (!_id) {
      return response.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false,
      });
    }


    // Fetch user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }


    // Check if address belongs to user
    const isAddressLinked = user.address_details.includes(_id);
    if (!isAddressLinked) {
      return response.status(403).json({
        message: "Unauthorized: Address does not belong to user",
        error: true,
        success: false,
      });
    }


    // Delete the address document
    const deletedAddress = await AddressModel.findByIdAndDelete(_id);
    if (!deletedAddress) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }


    // Remove address ID from user's address_details array
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { address_details: _id },
    });


    return response.json({
      message: "Address deleted permanently and removed from user record",
      error: false,
      success: true,
    });


  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
