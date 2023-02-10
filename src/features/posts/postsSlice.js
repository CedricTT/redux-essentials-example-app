import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { client } from '../../api/client'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async initialState => {
        const response = await client.post('/fakeApi/posts', initialState)
        return response.data
    }
)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.entities[id]
            if(existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const exitingPost = state.entities[postId]
            if(exitingPost) {
                exitingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                postsAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)
        }
    }
)

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
