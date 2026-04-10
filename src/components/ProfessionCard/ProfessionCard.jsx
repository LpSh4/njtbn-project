import "./ProfessionCard.scss";

const maxLength = 100;

const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
};

export const ProfessionCard = ({ data, role }) => {
    if (!data) return null;

    const experienceText = data.experience
        ? `${data.experience} ${data.experience === 1 ? "year" : "years"}`
        : "No experience";

    const cityText = data.city || "Unknown";

    const firstContainer = role === "specialist"
        ? [
            { label: "Profession", value: data.profession },
            { label: "Desired salary", value: `${data.desiredSalaryFrom || "—"} $` },
            { label: "Work format", value: data.workFormat || "—" },
            { label: "Created", value: data.createdAt ? new Date(data.createdAt).toLocaleString() : "—" },
        ]
        : [
            { label: "Profession", value: data.profession },
            { label: "Salary", value: `${data.salaryFrom || "—"} - ${data.salaryTo || "—"} $` },
            { label: "Work format", value: data.workFormat || "—" },
            { label: "Created", value: data.createdAt ? new Date(data.createdAt).toLocaleString() : "—" },
        ];

    const secondContainer = [
        { label: "Status", value: data.status || "Hidden" },
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

            <div className="card__description">
                <p>{truncate(role === "specialist" ? data.experienceDescription : data.description, maxLength)}</p>
            </div>

            <div className="card__btn-cont">
                <button>Learn more</button>
            </div>
        </article>
    );
};