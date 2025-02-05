    import { createSlice } from "@reduxjs/toolkit";

    const initialValue = {
        allCategory : [],
        loadingCategory : false,
        Allproduct : []
    }

    const productSlice = createSlice({
        name : 'product',
        initialState : initialValue,
        reducers : {
            setAllCategory : (state,action)=>{
                state.allCategory = [...action.payload]
                console.log(state.allCategory)
            },
            setLoadingCategory : (state,action)=>{
                state.loadingCategory = action.payload
            },
            setAllProduct : (state,action)=>{

                console.log("calling",state.product);

                state.Allproduct = [...action.payload]
            }
        }
    })

    export const  { setAllCategory,setLoadingCategory ,setAllProduct} = productSlice.actions

    export default productSlice.reducer