import "./modalLogin.scss"

export const ModalLogin = () => {
    return (
        <>
            <section>
                <h1>Войдите в аккаунт</h1>
                <form action="">
                    <div>

                    <p>
                        <label htmlFor="">Логин</label>
                        <input type="text"/>
                    </p>

                    <p>
                        <label htmlFor="">Пароль</label>
                        <input type="text"/>
                    </p>
                    </div>
                    <a href="">Впервые здесь? Зарегистрироваться</a>
                </form>
            </section>
        </>
    )
}

export default ModalLogin