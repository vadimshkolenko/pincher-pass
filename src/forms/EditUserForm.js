import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import Modal from '../Modal'

const EditUserForm = props => {
    // в качестве начального аргумента передаем
    // пользователя, которого собираемся редактировать
    const [user, setUser] = useState(props.currentUser)
    const [emails, setEmails] = useState(props.currentUser.emails)

    const [isShowModal, setIsShowModal] = useState(false)
    const [blockButton, setBlockButton] = useState(true)

    useEffect(() => {
        if (!user.name ||
            !user.surname ||
            !user.surname ||
            !user.patronymic ||
            !user.birth ||
            !user.phone ||
            !user.emails ||
            !user.specialty ||
            !user.group) {
            setBlockButton(true)
        } else {
            setBlockButton(false)
        }
    }, [user])

    const isCloseModal = () => {
        setIsShowModal(false)
    }


    const handleInputChange = event => {
        const { name, value } = event.target

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        if (!user.name || !user.surname) return

        props.updateUser(user.id, user)
        setIsShowModal(true)
    }

    const handleDeleteUser = id => {
        props.deleteUser(id)
    }

    //mail

    const emailInputChange = (event) => {
        let
            value = event.target.value,
            index = event.target.id,
            emailsArray = [...emails]

        emailsArray[index].email = value
        setEmails(emailsArray)
        setUser({ ...user, emails: emailsArray })
    }

    const addEmailField = (event) => {
        event.preventDefault()
        setEmails([...emails, { email: '' }])
    }

    const removeEmailField = (key) => {
        setEmails([...emails.filter((email, index) => index !== key)])
        // setUser({ ...user, emails: emails })
        setUser({ ...user, emails: [...emails.filter((email, index) => index !== key)] })
    }


    return (
        <div>
            <div className="mandatoryField">
                <sup>*</sup> - поле обязательно для заполнения
                <h2>Редактирование данных</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Имя<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange} />
                <label>Фамилия<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="surname"
                    value={user.surname}
                    onChange={handleInputChange} />
                <label>Отчество<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="patronymic"
                    value={user.patronymic}
                    onChange={handleInputChange} />
                <label>Дата рождения<sup>*</sup></label>
                <input
                    required
                    type="date"
                    name="birth"
                    value={user.birth}
                    onChange={handleInputChange} />
                <label>Телефон<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange} />
                <label>Почта<sup>*</sup></label>
                {
                    !emails ? null :
                        emails.map((email, index) => {
                            return (
                                <div key={index} className="email-field">
                                    <input
                                        required
                                        id={index}
                                        type="text"
                                        name="email"
                                        value={emails[index].email}
                                        onChange={emailInputChange}
                                    />
                                    <button onClick={(event) => {
                                        event.preventDefault()
                                        removeEmailField(index)
                                    }
                                    }>-</button>
                                </div>
                            )
                        })
                }
                <button onClick={addEmailField}>Добавить почту</button>
                <label>Направление подготовки</label>
                <select name="specialty" value={user.specialty} onChange={handleInputChange}>
                    <option value="веб-технологии" defaultValue>веб-технологии</option>
                    <option value="САПР">САПР</option>
                    <option value="информационная безопасность">информационная безопасность</option>
                    <option value="прикладная информатика">прикладная информатика</option>
                </select>
                <label>Группа<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="group"
                    value={user.group}
                    onChange={handleInputChange} />
                <button onClick={() => setIsShowModal(true)} disabled={blockButton}>Сохранить</button>

                <NavLink to="/students">
                    <button
                        className="button muted-button"
                        onClick={() => handleDeleteUser(user.id)}
                    >Удалить</button>
                </NavLink>

                <NavLink to="/students">
                    <button
                        onClick={() => props.setEditing(false)}
                        className="button muted-button"
                    >Назад
                </button>
                </NavLink>
            </form>
            {isShowModal && <Modal isCloseModal={isCloseModal} message={'Данные изменены'} />}
        </div>
    )
}

export { EditUserForm }