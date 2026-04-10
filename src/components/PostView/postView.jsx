import "./postView.scss"
import {PostViewHead} from "../postViewHead/postViewHead.jsx"
import {PostViewBody} from "../PostViewBody/postViewBody.jsx"
import {PostViewProfile} from "../PostViewProfile/PostViewProfile.jsx"


export const PostView = ({ data, type }) => {
    return (
        <section className="postview">
            <section className="postview__content">
                <PostViewHead data={data} type={type} />
                <PostViewBody data={data} type={type} />
            </section>

            <section>
                <PostViewProfile data={data} type={type} />
            </section>
        </section>
    );
};