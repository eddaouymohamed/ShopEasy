import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    loading: false,
    success: false,
    error: null,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    message: null
}
export const register = createAsyncThunk('user/register', async (userData, {

    rejectWithValue
}) => {
    try {
        console.log('userData user Data', userData);

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/register', userData, config);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'registration failed please try again' });
    }

})
export const login = createAsyncThunk('user/login', async ({ email, password }, {
    rejectWithValue
}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/v1/login', { email, password }, config);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'login failed please try again');
    }

})
export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/profile')
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'load user data failed ');

    }
})
export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/logout', { withCredentials: true })
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || 'logout user  failed ');

    }
})
export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.put('/api/v1/profile/update', userData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'update user Profile failed ' });

    }
})
export const updatePassword = createAsyncThunk('user/updatePassword', async (formData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put('/api/v1/update/password', formData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'update password IS FAILED ' });

    }
})
export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/forgot/password', email, config)
        return data;

    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data || { message: 'email failed to sent ' });

    }
})
export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, userData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(`/api/v1/reset/${token}`, userData, config)
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'failed to reset password' });

    }
})
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeErrors: (state, _action) => {
            state.error = null;
        },
        removeSuccess: (state, _) => {
            state.success = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state, _action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log('fullfiled res registration', action.payload.user)
                state.user = action.payload?.user || null;
                state.success = action.payload.success || true;
                state.isAuthenticated = Boolean(state.user)
                // local storage data
                localStorage.setItem('user', JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))


            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'registration failed please try again';
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(login.pending, (state, _action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log('fullfiled res login', action.payload.user)
                state.user = action.payload?.user || null;
                state.success = action.payload.success || true;
                state.isAuthenticated = Boolean(state.user)
                localStorage.setItem('user', JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))



            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'login failed please try again';
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(loadUser.pending, (state, _action) => {
                state.loading = true;
                console.log('load user pending')
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log('fullfiled res loading user data', action.payload.user)
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(state.user)
                //local stoarge data
                localStorage.setItem('user', JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))






            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'failed to load user Profile';
                state.user = null;
                state.isAuthenticated = false
                if (action.payload?.statusCode === 401) {
                    state.user = null;
                    state.isAuthenticated = false;
                    localStorage.removeItem('user')
                    localStorage.removeItem('isAuthenticated')
                }
            })
            //logout User
            .addCase(logout.pending, (state, _action) => {
                state.loading = true;
                console.log('load user pending')
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // console.log('fullfiled res logout user data', action.payload.user)
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user')
                localStorage.removeItem('isAuthenticated')




            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'failed to logout user';
            })
            //upadte Profile USER
            .addCase(updateProfile.pending, (state, _action) => {
                state.loading = true;
                console.log('load user pending')
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                console.log('fulfiled updated profile succefuly')
                state.loading = false;
                state.error = null;
                // console.log('fullfiled res logout user data', action.payload.user)
                state.user = action.payload?.user || state.user;
                state.message = action.payload?.message || 'Profile updated userSlice succesfully'
                state.success = action.payload?.success || true;
                console.log(state.success, state.user, state.message)
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'failed to upadte user Profile try again';
            })
            .addCase(updatePassword.pending, (state, _action) => {
                state.loading = true;
                console.log('load update password pending')
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                console.log('fulfiled updated passwored succefuly')
                state.loading = false;
                state.error = null;
                // state.user =  action.payload?.user || state.user;
                // state.message=action.payload?.message || 'Profile updated userSlice succesfully'
                state.success = action.payload?.success || true;
                console.log(state.success, 'update passwofrd succes')
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'failed to upadte password try again';
                state.success = false;
            })
            // frogot password
            .addCase(forgotPassword.pending, (state, _action) => {
                state.loading = true;
                console.log('load forgot password pending')
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                console.log('fulfiled forgot password passwored succefuly')
                state.loading = false;
                state.error = null;
                // state.user =  action.payload?.user || state.user;
                // state.message=action.payload?.message || 'Profile updated userSlice succesfully'
                state.success = action.payload?.success || true;
                state.message = action.payload?.message
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'email sent failed';
                state.success = false;
                console.log(state.error)
            })
            // rsest password
            .addCase(resetPassword.pending, (state, _action) => {
                state.loading = true;
                console.log('load reset password pending')
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                console.log('fulfiled reset password passwored succefuly')
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success || true;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'reset password  failed';
                state.success = false;
            })


    }
})
export default userSlice.reducer;
export const { removeErrors, removeSuccess } = userSlice.actions;