import React from "react";
import { Link } from "react-router-dom";
import { useGetPostQuery } from "../../api/apiSlice";
import { Spinner } from "../../components/Spinner";
import { PostAuthor } from "./PostAuthor";

import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const SinglePostPage = ({ match }) => {
    const { postId } = match.params

    const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

    let content

    if(isFetching) {
        content = <Spinner text="Loading..." />
    } else if(isSuccess) {
        content = (
            <article className="post">
                <h2>{post.title}</h2>
                <PostAuthor userId={post.userId}/>
                <TimeAgo timestamp={post.date}/>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPosts/${postId}`} className="button">
                    Edit Post
                </Link>
            </article>
        )
    }

    return (
        <section>
            {content}        
        </section>
    )
}