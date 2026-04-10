import "./postViewHead.scss"
export const PostViewHead = ({ data, type }) => {
    return (
        <section className="view-head">
            <div className="view-head__content">
                <h2>{data.profession || "title"}</h2>

                <div className="view-head__description">
                    <h3>
                        {type === "resume"
                            ? `${data.desiredSalaryFrom}$`
                            : `${data.salaryFrom || ""} - ${data.salaryTo || ""}`}
                    </h3>

                    <div className="view-head__text">
                        <p>Experience: {data.experience || 0}</p>
                        <p>Working hours: {data.workingHours || "none"}</p>
                        <p>Working schedule: {data.workSchedule || "none"}</p>
                        <p>Work format: {data.workFormat || "-"}</p>
                        <p>Education: {data.educations?.join(", ") || "none"}</p>
                        <p>Region: {data.city || "-"}</p>
                    </div>
                </div>
            </div>

            <button>Answer</button>
        </section>
    );
};