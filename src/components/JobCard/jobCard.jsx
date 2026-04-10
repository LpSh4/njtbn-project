import "./jobCard.scss"

export const JobCard = ({ title, salary, company, location, onClick }) => {
    const maxLength = 20

    const truncate = (text, max) => {
        if (!text) return ''
        return text.length > max ? text.slice(0, max) + '...' : text
    }

    return (
        <article className="job-card">
            <div className="job-card__description">
                <div className="job-card__text">
                    <h2>{truncate(title, maxLength)}</h2>
                    <p>{salary}</p>
                </div>
                <p>
                    {truncate(company, maxLength)}, {truncate(location, maxLength)}
                </p>
            </div>
            <div className="job-card__btn-cont">
                <button onClick={onClick} className="job-card__btn">
                    Узнать больше
                </button>
            </div>
        </article>
    )
}