import "./postViewHead.scss"
export const PostViewHead = ({ data, type }) => {
    const eduMap = {
        'SECONDARY_VOCATIONAL': 'Secondary vocational',
        'HIGHER': 'Higher education'
    };

    return (
        <section className="view-head">
            <div className="view-head__content">
                <h2>{data.profession || "No title"}</h2>
                <div className="view-head__description">
                    <h3>
                        {type === "resume"
                            ? `${data.desiredSalaryFrom || 0}$`
                            : `${data.salaryFrom || 0} - ${data.salaryTo || 0}$`}
                    </h3>

                    <div className="view-head__text">
                        <p>Experience: {data.experience || 0} years</p>

                        {}
                        {data.workingHours && <p>Working hours: {data.workingHours}</p>}
                        {data.workSchedule && <p>Working schedule: {data.workSchedule}</p>}

                        {data.workFormat && <p>Work format: {data.workFormat}</p>}

                        {data.educations && data.educations.length > 0 && (
                            <p>Education: {data.educations.map(e => eduMap[e] || e).join(", ")}</p>
                        )}
                        <p>Region: {data.city || "Not specified"}</p>
                    </div>
                </div>
            </div>
            <button>Answer</button>
        </section>
    );
};