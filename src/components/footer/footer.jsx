import "./footer.scss";
import footerlogo from  "./icons/logo-footer.png";

export const Footer = () => {
    return(
        <footer className="footer">
            <div className="footer__container">
                <div><img src={footerlogo} alt=""/></div>
                <div><p>NJTBN - сайт для поиска специалистов и работодателей по всей России</p></div>
            </div>
            <div className="text-container">
                <div className="list-container">
                    <h2>Общая информация</h2>
                    <ul className={"list-container__list"}>
                        <li><a target={"_blank"} href="">О компании</a></li>
                        <li><a target={"_blank"} href="">Партнёрам</a></li>
                        <li><a target={"_blank"} href="">Требования к ПО</a></li>
                        <li><a target={"_blank"} href="">Наши новости</a></li>
                        <li><a target={"_blank"} href="">Про cookie</a></li>

                    </ul>
                </div>

                <div className="list-container">
                    <h2>Связь с нами</h2>
                    <ul className={"list-container__list"}>
                        <li><a target={"_blank"} href="">Телеграм</a></li>
                        <li><a target={"_blank"} href="https://vk.com/id9900203">ВКонтакте</a></li>
                        <li><a target={"_blank"} href="">Whatsapp</a></li>
                        <li><a target={"_blank"} href="">Facebook</a></li>
                        <li><a target={"_blank"} href="">Twitter</a></li>

                    </ul>
                </div>


            </div>
        </footer>
    )
}