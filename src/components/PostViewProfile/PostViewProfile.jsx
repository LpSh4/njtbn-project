import "./PostViewProfile.scss";
import Ellipse from "./icons/Ellipse.png";

export const PostViewProfile = ({ data, type }) => {
    return (
        <section className="postview-profile">

            <div className="postview-profile__info">
                <img src={Ellipse} alt="" />

                <div>
                    <p>
                        {type === "vacancy"
                            ? data.companyName || "Company"
                            : `${data.name || ""} ${data.surname || data.surname || ""}`}
                    </p>

                    <p>
                        {type === "vacancy"
                            ? data.companyWebsite || "Website"
                            : data.city || "City"}
                    </p>
                </div>
            </div>

            <div className="postview-profile__content">

                <p>
                    Manager: {data.name || "Unknown"}
                </p>

                <p>
                    Phone: {data.phone || "Not available"}
                </p>

            </div>

        </section>
    );
};