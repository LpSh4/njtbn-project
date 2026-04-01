import "./header.scss";
import {Link} from "react-router-dom";
import logo from "./icons/logo-temp.png";
import bell from "./icons/Bell.png";
import fav from "./icons/fav-icon.png";
import chat from "./icons/chat-thing.png";

export default function Header() {
    return (
        <header className="header">
            <div className="header__logo">

                <a className="header__img"><img style={{ width: "60px" }}  src={logo} alt=""/></a>
                <div><a style={{fontSize:"20px"}} href="">Войти</a></div>
            </div>
            <nav className="header__nav">
                <ul className="header__list">
                    <li className="header__list-item">
                        <a href=""><img style={{ width: "25px" }} src={bell} alt="" /></a>
                    </li>
                    <li className="header__list-item">
                        <a href=""><img style={{ width: "25px" }} src={fav} alt="" /></a>
                    </li>
                    <li className="header__list-item">
                        <a href=""><img style={{ width: "25px" }} src={chat} alt="" /></a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}