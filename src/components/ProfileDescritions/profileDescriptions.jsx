import "./profileDescriptions.scss"
import edit from "./icons/edit.png"


export const ProfileDescriptions = () => {
    const text = 'One morning, when Gregor Samsa woke from troubled dreams, he found  himself transformed in his bed into a horrible vermin. He lay on his  armour-like back, and if he lifted his head a little he could see his  brown belly, slightly domed and divided by arches into stiff sections.  The bedding was hardly able to cover it and seemed ready to slide off  any moment. His many legs, pitifully thin compared with the size of the  rest of him, waved about helplessly as he looked. "What\'s happened to  me?" he tho'
    return (
        <>
        <section className="description">
            <div className="description__title">
                <h2>Profile description</h2>
               <button><img src={edit} alt=""/></button>
            </div>
            <div className="description__text-cont">
                <p>{text}</p>
            </div>
            
          
        </section>
        </>
    )
}

