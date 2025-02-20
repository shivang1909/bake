import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    loadingValue : false,
    isCartOpen : false
}

const loadingSlice = createSlice({
    name: 'loading',
    initialState: initialValue,
    reducers:{
        setDataLoading : (state,action) => {
            state.loadingValue = action.payload
        },
        setIsCartOpen : (state,action) => {
            state.isCartOpen=action.payload
        }
    }
})

export const { setDataLoading ,setIsCartOpen} = loadingSlice.actions

export default loadingSlice.reducer