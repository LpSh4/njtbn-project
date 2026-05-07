import "./PostViewProfile.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostViewProfile = ({ data, type }) => {

    const companyDisplayName = data.companyName || data.company || "Company Name";
    const contactName = data.name || data.contactPerson;

    return (
        <section className="postview-profile">
            <div className="postview-profile__info">
                <img src={Ellipse} alt="Avatar" />
                <div>
                    <p className="postview-profile__title">
                        {type === "vacancy"
                            ? companyDisplayName
                            : `${data.name || "Name"} ${data.surname || ""}`.trim()}
                    </p>
                    {}
                    <p className="postview-profile__city">{data.city || "Region not specified"}</p>
                </div>
            </div>

            <div className="postview-profile__content">
                {}
                <p>Manager: {contactName || "Information hidden"}</p>

                {}
                {data.phone ? (
                    <p>Phone: {data.phone}</p>
                ) : (
                    <p>Phone: {type === "vacancy" ? "Not provided" : "Hidden"}</p>
                )}

                {}
                {data.companyWebsite ? (
                    <p>
                        <a href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                           target="_blank"
                           rel="noreferrer"
                           style={{ color: '#2b12b3', textDecoration: 'underline' }}>
                            Visit Website
                        </a>
                    </p>
                ) : (
                    type === "vacancy" && <p className="no-data">Website: No link</p>
                )}
            </div>
        </section>
    );
};