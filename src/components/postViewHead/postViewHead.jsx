import { api } from "../../api/axios";
import "./postViewHead.scss";

export const PostViewHead = ({ data, type }) => {
    const userRole = localStorage.getItem("role")?.toLowerCase();

    const eduMap = {
        'SECONDARY_VOCATIONAL': 'Secondary vocational',
        'HIGHER': 'Higher education'
    };

    const handleAction = async () => {
        try {
            if (type === "vacancy") {
                await api.post(`/applications/apply/${data.id}`);
                alert("Application sent successfully!");
            } else if (type === "resume") {
                alert("Invite logic: vacancy selection or direct invite");
            }
        } catch (err) {
            if (err.response?.status === 409) {
                alert("You have already interacted with this post.");
            } else {
                console.error("Action error:", err);
                alert("Failed to process request.");
            }
        }
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

            <div className="view-head__actions">
                {}
                {type === "vacancy" && userRole === "specialist" && (
                    <button className="view-head__btn" onClick={handleAction}>
                        Apply now
                    </button>
                )}

                {}
                {type === "resume" && userRole === "employer" && (
                    <button className="view-head__btn invite" onClick={handleAction}>
                        Invite to job
                    </button>
                )}
            </div>
        </section>
    );
};