import Promocode from '../models/promocode.model.js';

/**
 * Get all promocodes
 * @route GET /api/promocode
 * @access Private (Admin)
 */
export const getAllPromocodes = async (req, res) => {
  try {
    const promocodes = await Promocode.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: promocodes,
      message: 'Promocodes retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching promocodes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve promocodes',
      error: error.message,
    });
  }
};


export const getFilterdPromocodes = async (req, res) => {
    try {
      const { orderAmount } = req.body;
    //   console.log("Received order amount:", req.body); // Debugging
      
      // Convert orderAmount to number
      const amount = Number(orderAmount);
      
      // Get current date for expiry comparison
      const currentDate = new Date();
      
    //   const query = {
    //     isActive: true,
    //     minOrderValue: { $lte: amount },  // Check if minOrderValue is less than or equal to amount
    //     expiryDate: { $gte: currentDate },  // Check if expiry date is in the future
    //     $expr: { $gt: [{ $size: "$users" }, "$usageLimit"] }  // Ensure the number of users is less than or equal to the usage limit
    // };
    
      
    //   // Find applicable promocodes
    //   const promocodes = await Promocode.find(query).sort({ 
    //     discountType: -1,  // Sort percentage discounts first
    //     discountValue: -1  // Then by discount value (highest first)
    //   });
    const promocodes = await Promocode.find({
        isActive: true,
        minOrderValue: { $lte: amount },  // Ensure minOrderValue is ≤ 600
        expiryDate: { $gte: new Date() },  // Ensure expiryDate is in the future
        $expr: { $lt: [{ $size: "$users" }, "$usageLimit"] }  // Ensure users count is less than usageLimit
    });
    //   console.log("All promo",promocodes);
      
      
      // Calculate potential discount for each promocode
      const promocodesWithSavings = promocodes.map(promocode => {
        let potentialDiscount = 0;
        
        if (promocode.discountType === 'percentage') {
          potentialDiscount = (amount * promocode.discountValue / 100);
          // Apply max discount cap if exists
          if (promocode.maxDiscount > 0 && potentialDiscount > promocode.maxDiscount) {
            potentialDiscount = promocode.maxDiscount;
          }
        } else {
          // Fixed discount
          potentialDiscount = promocode.discountValue;
        }
        
        return {
          ...promocode.toObject(),
          potentialSavings: potentialDiscount
        };
      });
      
      res.status(200).json({
        success: true,
        data: promocodesWithSavings,
        message: 'Applicable promocodes retrieved successfully',
      });
    } catch (error) {
      console.error('Error fetching applicable promocodes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve applicable promocodes',
        error: error.message,
      });
    }
  };
/**
 * Create a new promocode
 * @route POST /api/promocode
 * @access Private (Admin)
 */
export const createPromocode = async (req, res) => {
    try {
      console.log("Received request body:", req.body); // Debugging
  
      const {
        code,
        minOrderValue,
        usageLimit,
        discountType,
        discountValue,
        maxDiscount,
        expiryDate,
        isActive,
      } = req.body;
  
      if (!code) {
        return res.status(400).json({ success: false, message: 'Promocode code is required' });
      }
  
      const existingPromocode = await Promocode.findOne({ code: code.toUpperCase() });
      if (existingPromocode) {
        return res.status(400).json({ success: false, message: 'Promocode with this code already exists' });
      }
  
      if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
        return res.status(400).json({ success: false, message: 'Percentage discount must be between 0 and 100' });
      }
  
      const newPromocode = new Promocode({
        code: code.toUpperCase(),
        minOrderValue,
        usageLimit,
        discountType,
        discountValue,
        maxDiscount,
        expiryDate,
        isActive: isActive === 'true' || isActive === true,
      });
  
      await newPromocode.save();
      res.status(201).json({
        success: true,
        data: newPromocode,
        message: 'Promocode created successfully',
      });
    } catch (error) {
      console.error('Error creating promocode:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create promocode',
        error: error.message,
      });
    }
  };
  

/**
 * Update an existing promocode
 * @route PUT /api/promocode
 * @access Private (Admin)
 */

export const updatePromocode = async (req, res) => {
  try {
    const { _id, code, minOrderValue, usageLimit, discountType, discountValue, maxDiscount, expiryDate, isActive } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, message: 'Promocode ID is required' });
    }

    const promocode = await Promocode.findById(_id);
    if (!promocode) {
      return res.status(404).json({ success: false, message: 'Promocode not found' });
    }

    if (code && code.toUpperCase() !== promocode.code) {
      const existingPromocode = await Promocode.findOne({ code: code.toUpperCase() });
      if (existingPromocode) {
        return res.status(400).json({ success: false, message: 'Promocode with this code already exists' });
      }
    }

    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ success: false, message: 'Percentage discount must be between 0 and 100' });
    }

    const updatedFields = {
      code: code ? code.toUpperCase() : promocode.code,
      minOrderValue: minOrderValue ?? promocode.minOrderValue,
      usageLimit: usageLimit ?? promocode.usageLimit,
      discountType: discountType ?? promocode.discountType,
      discountValue: discountValue ?? promocode.discountValue,
      maxDiscount: maxDiscount ?? promocode.maxDiscount,
      expiryDate: expiryDate ?? promocode.expiryDate,
      isActive: isActive === 'true' || isActive === true,
    };

    const updatedPromocode = await Promocode.findByIdAndUpdate(_id, updatedFields, { new: true });

    return res.status(200).json({
      success: true,
      data: updatedPromocode,
      message: 'Promocode updated successfully',
    });
  } catch (error) {
    console.error('Error updating promocode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update promocode',
      error: error.message,
    });
  }
};


/**
 * Delete a promocode
 * @route DELETE /api/promocode/:id
 * @access Private (Admin)
 */
export const deletePromocode = async (req, res) => {
  try {
    const { id } = req.params;

    const promocode = await Promocode.findById(id);
    if (!promocode) {
      return res.status(404).json({ success: false, message: 'Promocode not found' });
    }

    await Promocode.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Promocode deleted successfully' });
  } catch (error) {
    console.error('Error deleting promocode:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promocode',
      error: error.message,
    });
  }
};

/**
 * Verify if a promocode is valid
 * @route POST /api/promocode/verify
 * @access Private
 */
export const verifyPromocode = async (req, res) => {
  try {
    const { code ,orderAmount} = req.body;
    const promocode = await Promocode.findOne({ code: code.toUpperCase() });
    let isValid = true;

    promocode.users.forEach(user => {
      if (user.toString() === req.userId.toString()) {
            isValid = false;
            return
        }
    });
    
    if(!isValid){
        return res.status(400).json({ success: true, message: 'Promocode is Used for this User' });
    }
    let discountAmount = 0;
    if (promocode.discountType === 'percentage') {
      discountAmount = (orderAmount * promocode.discountValue) / 100;
      if (discountAmount > promocode.maxDiscount) {
        discountAmount = promocode.maxDiscount;
      }
    } else {
      discountAmount = promocode.discountValue;
    }

    return res.status(200).json({
      success: true,
      data: {
        // promocode,
        discountAmount,
        // finalAmount: orderAmount - discountAmount,
      },
      message: 'Promocode is valid',
    });
  } catch (error) {
    console.error('Error verifying promocode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify promocode',
      error: error.message,
    });
  }
};
