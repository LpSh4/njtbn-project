import "./footer.scss";
import footerlogo from  "./icons/logo-footer.png";

export const Footer = () => {
    return(
        <footer className="footer">
            <div className="footer__container">
                <div><img src={footerlogo} alt=""/></div>
                <div><p>NJTBN - a website for finding specialists and employers throughout Russia</p></div>
            </div>
            <div className="text-container">
                <div className="list-container">
                    <h2>General information</h2>
                    <ul className={"list-container__list"}>
                        <li><a target={"_blank"} href="https://vk.com/id777264194">Me</a></li>
                        <li><a target={"_blank"} href="https://vk.com/nemotahir">Partners</a></li>
                        <li><a target={"_blank"} href="https://www.championat.com/cybersport/news-6349714-mewgenics-sistemnye-trebovaniya-russkij-yazyk.html">Software Requirements</a></li>
                        <li><a target={"_blank"} href="https://vk.com/college.nngasu">Our news</a></li>
                        <li><a target={"_blank"} href="https://react.dev/">React</a></li>
                    </ul>
                </div>

                <div className="list-container">
                    <h2>Contact with us</h2>
                    <ul className={"list-container__list"}>
                        <li><a target={"_blank"} href="https://web.telegram.org/">Telegram</a></li>
                        <li><a target={"_blank"} href="https://vk.com/id9900203">VK</a></li>
                        <li><a target={"_blank"} href="https://web.whatsapp.com/">Whatsapp</a></li>
                        <li><a target={"_blank"} href="https://www.facebook.com/?locale=ru_RU">Facebook</a></li>
                        <li><a target={"_blank"} href="https://x.com/account/access">Twitter</a></li>

                    </ul>
                </div>


            </div>
        </footer>
    )
}