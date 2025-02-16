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
            setAllProduct: (state, action) => {
                // Replace the entire product list
                console.log("i am on set all product",action.payload);
                
                state.Allproduct = action.payload;
              },
              addProduct: (state, action) => {
                console.log("i am on add product",action.payload);

                // Add a single product to the list 
                state.Allproduct = [action.payload, ...state.Allproduct];
              },
    //         setAllProduct : (state,action)=>{
    //             console.log("Payload Received in Reducer:", action.payload);
    //             // console.log("Is Payload an Array?", Array.isArray(action.payload));
            
    //         console.log(state.Allproduct)
    // state.Allproduct = [...state.Allproduct, ...action.payload.products];
                  
    //             // console.log("calling",state.Allproduct);
    //         }
        }
    })

    export const  { setAllCategory,setLoadingCategory ,setAllProduct,addProduct} = productSlice.actions

    export default productSlice.reducer