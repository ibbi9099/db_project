import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user:null
    },
    reducers: {
        setUser: (state, action) => {
            console.log("Redux setUser called with:", action.payload); // Log incoming user data
            state.user = action.payload;
        }
        
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer;