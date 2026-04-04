import Header from "./components/Header/header.jsx";
import {Footer} from "./components/footer/footer.jsx";
import Home from "./pages/Home/home.jsx";

const App = () =>{
    return (
        <>

            <Header />
            <main className="main">
        <Home></Home>
            </main>

            <Footer />
        </>
    )
}

export default App


