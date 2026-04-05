import "./RegistrationChoose.scss"
import {useNavigate} from "react-router-dom";

export const RegistrationChoose = () => {
    const navigate = useNavigate();
    return (
        <>
        <section className="choose">
            <section className="choose__cont">
                <h2>Кто регистрируется?</h2>
                <div className="choose__link-cont">
                    <button onClick={() => navigate("/registerSpecialist")} className="choose__link">Специалист</button>
                    <button onClick={() => navigate("/registerEmployer")}  className="choose__link">Работодатель </button>
                </div>
            </section>

        </section>
        </>
    )
}
export default RegistrationChoose