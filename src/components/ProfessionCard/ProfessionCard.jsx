import "./ProfessionCard.scss";

const maxLength = 100;

const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
};

export const ProfessionCard = ({ data, role }) => {
    if (!data) return null;

    const rawExp = data.experience ?? data.resume?.experience;
    const cityText = data.city ?? data.resume?.city ?? "Not specified";

    const hasExperience = (typeof rawExp === 'number');
    const experienceText = hasExperience
        ? `${rawExp} ${rawExp === 1 ? "year" : "years"}`
        : "No experience";

    const isResume = !!data.desiredSalaryFrom || !!data.resume?.desiredSalaryFrom;

    const desc = isResume
        ? (data.experienceDescription ?? data.resume?.experienceDescription)
        : (data.description ?? data.vacancy?.description);

    const firstContainer = isResume
        ? [
            { label: "Profession", value: data.profession ?? data.resume?.profession },
            { label: "Desired salary", value: `${data.desiredSalaryFrom ?? data.resume?.desiredSalaryFrom ?? "—"} $` },
            { label: "Work format", value: data.workFormat ?? data.resume?.workFormat ?? "—" },
            { label: "Created", value: data.createdAt ? new Date(data.createdAt).toLocaleString() : "—" },
        ]
        : [
            { label: "Profession", value: data.profession ?? data.vacancy?.profession },
            { label: "Salary", value: `${data.salaryFrom ?? "—"} - ${data.salaryTo ?? "—"} $` },
            { label: "Work format", value: data.workFormat ?? data.vacancy?.workFormat ?? "—" },
            { label: "Created", value: data.createdAt ? new Date(data.createdAt).toLocaleString() : "—" },
        ];

    const secondContainer = [
        { label: "Status", value: data.status || "active" },
        { label: "City / Experience", value: `${cityText} / ${experienceText}` },
    ];

    return (
        <article className="card">
            <div className="card__text-cont">
                <div className="card__text">
                    {firstContainer.map((item, idx) => (
                        <div key={idx}>
                            {item.label === "Profession"
                                ? <h2>{item.value}</h2>
                                : <p>{item.value}</p>}
                        </div>
                    ))}
                </div>

                <div className="card__text">
                    {secondContainer.map((item, idx) => (
                        <div key={idx}>
                            <p>{item.label}: {item.value}</p>
                        </div>
                    ))}
                </div>
            </div>


        </article>
    );
};