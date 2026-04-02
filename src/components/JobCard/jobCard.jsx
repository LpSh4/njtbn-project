import "./jobCard.scss"

export const JobCard = ({ title, salary, company, location }) => {

    return (
        <article className="job-card">
            <div className="job-card__description">
                <div className="job-card__text">
                    <h2>{title}</h2>
                    <p>{salary}</p>
                </div>
                <p>{company}, {location}</p>
            </div>
            <div className="job-card__btn-cont">
            <button className="job-card__btn">
                Узнать больше
            </button>
            </div>
        </article>
    )
}