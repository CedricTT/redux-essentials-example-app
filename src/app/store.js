import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import postReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'
import notificationReducer from '../features/notifications/notificationsSlice'
import { apiSlice } from '../api/apiSlice'

export default configureStore({
  reducer: {
    posts: postReducer,
    users: usersReducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})
