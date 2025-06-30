import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
    _id : "",
    name : "",
    email : undefined,
    avatar : "",
    mobile : "",
    alt_Mobile : "",
    verify_email : "",
    last_login_date : "",
    status : "",
    address_details : [],
    shopping_cart : [],
    orderHistory : [],
    role : "",
}


const userSlice  = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state,action) =>{  
            state._id = action.payload?._id
            state.name  = action.payload?.name
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.alt_Mobile = action.payload?.alt_Mobile
            state.verify_email = action.payload?.verify_email
            state.last_login_date = action.payload?.last_login_date
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role
        },
        updatedAvatar : (state,action)=>{
            state.avatar = action.payload
        },
        updatedShoppingCart : (state,action) => {
            console.log(action.payload);


            state.shopping_cart = action.payload
            console.log(state.shopping_cart);
           
        },
        logout : (state)=>{
            state._id = ""
            state.name  = ""
            state.email = undefined
            state.avatar = ""
            state.mobile = ""
            state.alt_Mobile = ""
            state.verify_email = ""
            state.last_login_date = ""
            state.status = ""
            state.address_details = []
            state.shopping_cart = []
            state.orderHistory = []
            state.role = ""
        },
       
    }
})


export const { setUserDetails, logout ,updatedAvatar, updatedShoppingCart} = userSlice.actions


export default userSlice.reducer
