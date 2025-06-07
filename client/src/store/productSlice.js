    import { createSlice } from "@reduxjs/toolkit";

    const initialValue = {
        allCategory : [],
        Allproduct : [],
    }

    const productSlice = createSlice({
        name : 'product',
        initialState : initialValue,
        reducers : {
            setAllCategory : (state,action)=>{
                state.allCategory = [...action.payload]
                // console.log(state.allCategory)
            },
            setAllProduct : (state,action)=>{
                console.log(action.payload);
                
                state.Allproduct = [...action.payload]
                console.log("calling",state.Allproduct);
                console.trace(); // 🔥 this prints the call stack
            }
        }
    })

    export const  { setAllCategory,setLoadingCategory ,setAllProduct ,setLoadingProduct} = productSlice.actions

    export default productSlice.reducer