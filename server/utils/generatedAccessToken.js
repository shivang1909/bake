// without role 

// import AdminModel from '../models/admin.model'

// const generatedAccessToken = async(userId)=>{
    
    //     const token = await jwt.sign({ id : userId}
    //         ,
    //         process.env.SECRET_KEY_ACCESS_TOKEN,
    //         { expiresIn : '5h'}
    //     )
    
    //     return token
    // }
    
    // export default generatedAccessToken
    
    
    // with role import jwt from 'jsonwebtoken';
    import jwt from 'jsonwebtoken'
import AdminModel from '../models/admin.model.js';  // Import your admin model to fetch the role

const generatedAccessToken = async (userId) => {
    // Fetch the user details from the admin collection (assuming role is stored there)
    const admin = await AdminModel.findById(userId);
    try {
            
    
    if (!admin) {
        // If no admin found, just create the token without the role
        const token = await jwt.sign(
            { id: userId },  // Only include the userId if no role is found
            process.env.SECRET_KEY_ACCESS_TOKEN,
            { expiresIn: '5h' }
        );
        
        return token;
    }

    // If admin is found, include the role in the token
    const token = await jwt.sign(
        { id: userId, role: admin.role },  // Add role here
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '5h' }
    );

    return token;
    }
    catch(error)
    {
            console.log("error",error)
    }
};

export default generatedAccessToken;
 