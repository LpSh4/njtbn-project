import "./home.scss"
import union from "./icons/hidden-gem.png"
import { JobCard } from "../../components/JobCard/jobCard.jsx"
import { ModalLogin } from "../../components/ModalLogin/ModalLogin.jsx"

export const Home = ({ setIsLoginOpen, isLoginOpen }) => {

    const jobsPopular = [
        {
            id: 1,
            title: "Senior React Developer",
            salary: "225000 - 280000 RUB",
            company: "Google",
            location: "Moscow"
        },
        {
            id: 2,
            title: "Picker-Packer",
            salary: "67000 - 85000 RUB",
            company: "Wildberries",
            location: "Moscow"
        },
        {
            id: 3,
            title: "Frontend Developer (Vue.js)",
            salary: "140000 - 190000 RUB",
            company: "Yandex",
            location: "Moscow"
        },
        {
            id: 4,
            title: "Delivery Driver (own car)",
            salary: "90000 - 130000 RUB",
            company: "Samokat",
            location: "Moscow"
        },
        {
            id: 5,
            title: "Middle Python Backend Developer",
            salary: "200000 - 250000 RUB",
            company: "Sber",
            location: "Moscow"
        },
        {
            id: 6,
            title: "Sushi Chef",
            salary: "75000 - 95000 RUB",
            company: "Dodo Pizza",
            location: "Moscow"
        }
    ];

    const jobsNews = [
        {
            id: 7,
            title: "IT Solutions Sales Manager",
            salary: "120000 - 250000 RUB",
            company: "Kaspersky",
            location: "Moscow"
        },
        {
            id: 8,
            title: "Junior Data Analyst",
            salary: "110000 - 145000 RUB",
            company: "Tinkoff",
            location: "Moscow"
        },
        {
            id: 9,
            title: "Electrician",
            salary: "95000 - 120000 RUB",
            company: "Mosenergo",
            location: "Moscow"
        },
        {
            id: 10,
            title: "Product Manager (FinTech)",
            salary: "230000 - 320000 RUB",
            company: "Alfa-Bank",
            location: "Moscow"
        },
        {
            id: 11,
            title: "Sales Consultant",
            salary: "55000 - 80000 RUB",
            company: "M.Video",
            location: "Moscow"
        },
        {
            id: 12,
            title: "DevOps Engineer",
            salary: "240000 - 300000 RUB",
            company: "VK",
            location: "Moscow"
        }
    ];

    const jobsRecent = [
        {
            id: 13,
            title: "Sushi Chef",
            salary: "75000 - 95000 RUB",
            company: "Dodo Pizza",
            location: "Moscow"
        },
        {
            id: 14,
            title: "Electrician",
            salary: "95000 - 120000 RUB",
            company: "Mosenergo",
            location: "Moscow"
        },
        {
            id: 15,
            title: "Nurse / Medical Nurse",
            salary: "85000 - 110000 RUB",
            company: "City Clinical Hospital №1",
            location: "Moscow"
        },
        {
            id: 16,
            title: "Welder",
            salary: "100000 - 140000 RUB",
            company: "Rosatom",
            location: "Moscow"
        },
        {
            id: 17,
            title: "IT Solutions Sales Manager",
            salary: "120000 - 250000 RUB",
            company: "Kaspersky",
            location: "Moscow"
        },
        {
            id: 18,
            title: "Digital Channels Marketer",
            salary: "130000 - 180000 RUB",
            company: "Leroy Merlin",
            location: "Moscow"
        }
    ];

    return (
        <>
            <section className="filter">
                <form
                    className="filter__form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setIsLoginOpen(true);
                    }}
                >
                    <h2>Register and look for a job now</h2>

                    <div className="filter__input">
                        <input
                            className="filter__search"
                            placeholder="Enter your phone number"
                            type="search"
                            onFocus={() => setIsLoginOpen(true)}
                        />

                        <button
                            type="submit"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </section>

            <section className="popular">
                <div className="popular__title">
                    <img loading="lazy" src={union} alt="" />
                    <h2>Popularity</h2>
                </div>

                <section className="popular__card-cont">
                    {jobsPopular.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                            onClick={() => setIsLoginOpen(true)}
                        />
                    ))}
                </section>
            </section>

            <section className="popular">
                <div className="popular__title">
                    <img loading="lazy" src={union} alt="" />
                    <h2>Fresh</h2>
                </div>

                <section className="popular__card-cont">
                    {jobsNews.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                            onClick={() => setIsLoginOpen(true)}
                        />
                    ))}
                </section>
            </section>

            <section className="popular">
                <div className="popular__title">
                    <img loading="lazy" src={union} alt="" />
                    <h2>Newly created</h2>
                </div>

                <section className="popular__card-cont">
                    {jobsRecent.map(job => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            salary={job.salary}
                            company={job.company}
                            location={job.location}
                            onClick={() => setIsLoginOpen(true)}
                        />
                    ))}
                </section>
            </section>

            <ModalLogin isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
        </>
    )
}

export default Home