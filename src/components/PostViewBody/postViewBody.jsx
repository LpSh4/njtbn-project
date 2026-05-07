import "./PostViewBody.scss"
export const PostViewBody = ({ data, type }) => {

    const descriptionText = type === "resume"
        ? data?.experienceDescription
        : data?.description;

    return (
        <section className="view-body">
            {}
            {descriptionText ? (
                <section className="view-body__description">
                    <h2>{type === "resume" ? "Experience description:" : "Job description:"}</h2>
                    <p>{descriptionText}</p>
                </section>
            ) : (
                <section className="view-body__description">
                    <p style={{ color: 'gray', fontStyle: 'italic' }}>
                        No detailed description provided for this {type}.
                    </p>
                </section>
            )}

            {}
            {(data?.requiredSkills?.length > 0 || data?.skills?.length > 0) && (
                <section className="view-body__required-cont">
                    <h2>Required skills:</h2>
                    <div className="view-body__required">
                        {(data.requiredSkills || data.skills).map((skill, i) => (
                            <p key={i} className="view-body__skill-cont">{skill}</p>
                        ))}
                    </div>
                </section>
            )}
        </section>
    );
};