import "./profileUser.scss"
import Check from "./icons/check.png"
import user from "./img/user.png"
import Vk from "./icons/contact-vk-icon.png"
import Telegram from "./icons/contact-telegram-icon.png"
import Twitter from "./icons/contact-twitter-icon.png"

export const ProfileUser = ({ data })=> {

    return (
        <>
            <section className="user">
                <div className="user__redact">
                <div>
                    <img src={Check} alt=""/>
                </div>
                    <form className="user__form"  action="">
                        <div className="user__input-field">
                    <p>John</p>
                    <p>Job</p>
                    <p>
                        <input type="date"/>
                    </p>
                        </div>
                        <button>
                            redact
                        </button>
                    </form>
                </div>


                <div className="user__profile">
                    <div className="user__url">
                        <a href=""><img src={Vk} alt=""/></a>
                        <a href=""><img src={Telegram} alt=""/></a>
                        <a href=""><img src={Twitter} alt=""/></a>
                    </div>
                    <div>
                        <img src={user} alt=""/>
                    </div>
                </div>
            </section>
        </>
    )
}
export default ProfileUser