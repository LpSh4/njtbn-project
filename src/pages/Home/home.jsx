import "./home.scss"
import union from "./icons/hidden-gem.png"
import {JobCard} from "../../components/JobCard/jobCard.jsx";

export const Home = () => {
    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 1,
            title: "Frontend Developer",
            salary: "67000-85000 рублей",
            company: "Google",
            location: "Москва"
        }
    ]
    return (
        <>
<section className="filter">
    <form action="" className="filter__form">
        <h2>Зарегистрируйтесь и ищите работу сейчас</h2>
        <div className="filter__input">
            <input className="filter__search" placeholder={"Введите номер телефона"} type="search"/>
            <button type={"submit"}>Продолжить</button>
        </div>
    </form>
</section>

            <section className="popular">
                <div className="popular__title"><img src={union} alt=""/><h2>Популярное</h2></div>

                <section className="popular__card-cont">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                        />
                    ))}
                </section>
            </section>

            <section className="popular">
                <div className="popular__title"><img src={union} alt=""/><h2>Свежие</h2></div>

                <section className="popular__card-cont">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                        />
                    ))}
                </section>
            </section>


            <section className="popular">
                <div className="popular__title"><img src={union} alt=""/><h2>Недавно созданные</h2></div>

                <section className="popular__card-cont">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                        />
                    ))}
                </section>
            </section>



        </>
    )
}

export default Home