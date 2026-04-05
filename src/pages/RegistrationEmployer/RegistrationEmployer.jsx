import "./RegistrationEmployer.scss"
import {useNavigate} from 'react-router-dom';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';

const RegistrationEmployer = () => {
    return (
        <>
            <RegistrationForm role="employer" />
        </>
    )
}

export default RegistrationEmployer;