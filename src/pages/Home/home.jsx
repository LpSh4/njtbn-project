import "./home.scss"
import union from "./icons/hidden-gem.png"
import {JobCard} from "../../components/JobCard/jobCard.jsx";

export const Home = ({ isLoginOpen, setIsLoginOpen }) => {
    const jobsPopular = [
        {
            id: 1,
            title: "Senior React Developer",
            salary: "225000 - 280000 рублей",
            company: "Google",
            location: "Москва"
        },
        {
            id: 2,
            title: "Грузчик-комплектовщик",
            salary: "67000 - 85000 рублей",
            company: "Wildberries",
            location: "Москва"
        },
        {
            id: 3,
            title: "Frontend Developer (Vue.js)",
            salary: "140000 - 190000 рублей",
            company: "Яндекс",
            location: "Москва"
        },
        {
            id: 4,
            title: "Водитель-курьер на личном авто",
            salary: "90000 - 130000 рублей",
            company: "Самокат",
            location: "Москва"
        },
        {
            id: 5,
            title: "Middle Python Backend Developer",
            salary: "200000 - 250000 рублей",
            company: "Sber",
            location: "Москва"
        },
        {
            id: 6,
            title: "Повар сушист",
            salary: "75000 - 95000 рублей",
            company: "Додо Пицца",
            location: "Москва"
        }
    ]

    const jobsNews = [
        {
            id: 7,
            title: "Менеджер по продажам (IT-решения)",
            salary: "120000 - 250000 рублей",
            company: "Kaspersky",
            location: "Москва"
        },
        {
            id: 8,
            title: "Младший Data Analyst",
            salary: "110000 - 145000 рублей",
            company: "Тинькофф",
            location: "Москва"
        },
        {
            id: 9,
            title: "Электрик",
            salary: "95000 - 120000 рублей",
            company: "Мосэнерго",
            location: "Москва"
        },
        {
            id: 10,
            title: "Product Manager (FinTech)",
            salary: "230000 - 320000 рублей",
            company: "Альфа-Банк",
            location: "Москва"
        },
        {
            id: 11,
            title: "Продавец-консультант",
            salary: "55000 - 80000 рублей",
            company: "М.Видео",
            location: "Москва"
        },
        {
            id: 12,
            title: "DevOps Engineer",
            salary: "240000 - 300000 рублей",
            company: "VK",
            location: "Москва"
        }
    ]

    const jobsRecent = [
        {
            id: 13,
            title: "Повар сушист",
            salary: "75000 - 95000 рублей",
            company: "Додо Пицца",
            location: "Москва"
        },
        {
            id: 14,
            title: "Электрик",
            salary: "95000 - 120000 рублей",
            company: "Мосэнерго",
            location: "Москва"
        },
        {
            id: 15,
            title: "Медсестра / Медицинская сестра",
            salary: "85000 - 110000 рублей",
            company: "Городская клиническая больница №1",
            location: "Москва"
        },
        {
            id: 16,
            title: "Сварщик",
            salary: "100000 - 140000 рублей",
            company: "Росатом",
            location: "Москва"
        },
        {
            id: 17,
            title: "Менеджер по продажам (IT-решения)",
            salary: "120000 - 250000 рублей",
            company: "Kaspersky",
            location: "Москва"
        },
        {
            id: 18,
            title: "Маркетолог цифровых каналов",
            salary: "130000 - 180000 рублей",
            company: "Леруа Мерлен",
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
                <div className="popular__title"><img loading={"lazy"} src={union} alt=""/><h2>Популярное</h2></div>

                <section className="popular__card-cont">
                    {jobsPopular.map(job => (
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
                <div className="popular__title"><img loading={"lazy"} src={union} alt=""/><h2>Свежие</h2></div>

                <section className="popular__card-cont">
                    {jobsNews.map(job => (
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
                <div className="popular__title"><img loading={"lazy"} src={union} alt=""/><h2>Недавно созданные</h2></div>

                <section className="popular__card-cont">
                    {jobsRecent.map(job => (
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