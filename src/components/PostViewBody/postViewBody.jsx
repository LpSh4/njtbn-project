import "./postViewBody.scss"

export const PostViewBody = ({ data, type }) => {
    const descriptionText =
        data?.experienceDescription ||
        data?.experience_description ||
        data?.description ||
        "No description";
    return (
        <section className="view-body">

            <section className="view-body__description">
                <h2>Job description:</h2>

                <p>
                    {descriptionText}
                </p>
            </section>

            <section className="view-body__required-cont">
                <h2>Required skills:</h2>

                <div className="view-body__required">
                    {(data.skills || data.requiredSkills || []).map((skill, i) => (
                        <p key={i} className="view-body__skill-cont">
                            {skill}
                        </p>
                    ))}
                </div>
            </section>

        </section>
    );
};