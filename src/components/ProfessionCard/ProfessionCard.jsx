import "./ProfessionCard.scss"


const maxLength = 20

const truncate = (text, max) => {
    if (!text) return ''
    return text.length > max ? text.slice(0, max) + '...' : text
}


export const ProfessionCard = () => (

    <>
        <article className="card">
            <div className="card__text-cont">
            <div className="card__text" >
                <div><h2>Profession</h2></div>
                <div><p>80000 dollars</p> </div>
                <div><p>From office</p></div>
                <div><p>Created 09.11.2001 in 12:25</p></div>

            </div>
                <div  className="card__text">
                    <div><p>Status: Hidden</p></div>
                    <div><p>Syktyvkar</p> <p>5 years</p></div>
                </div>
            </div>


            <div  className="card__description">
               <p> {truncate()} One morning, when Gregor Samsa
                   woke from troubled dreams, he found  himself
                   transformed in his bed into a horrible vermin.
                   He lay on his  armour-like ba... </p>
            </div>

            <div  className="card__btn-cont">
                <button>Learn more</button>
            </div>
        </article>
    </>
)