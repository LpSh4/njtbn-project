import "./ProfileProfession.scss"
import {ProfessionCard} from "../ProfessionCard/ProfessionCard.jsx"




export const ProfileProfession = () => (
    <>
        <section className="profession">
            <h2>Resume</h2>

            <section className="profession__cont">
                <h3>It's empty so far</h3>
                <ProfessionCard></ProfessionCard>
                <ProfessionCard></ProfessionCard>
                <ProfessionCard></ProfessionCard>
                <ProfessionCard></ProfessionCard>
            </section>
            <button>Add resume</button>
        </section>
    </>
)