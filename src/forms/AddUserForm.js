import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import MaskedInput from 'react-text-mask'
import Modal from '../Modal'
import { useEffect } from 'react';

const AddUserForm = props => {
    const initialFormState = { id: null, name: '', surname: '', patronymic: '', birth: '', phone: '', emails: [], specialty: 'веб-технологии', group: '' }
    // используем useState и передаем в качестве начального значения объект - initialFormState
    const [user, setUser] = useState(initialFormState)
    const [emails, setEmails] = useState([{ email: '' }])
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
        const
            name = event.currentTarget.name,
            value = event.currentTarget.value

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (!user.name || !user.surname) return

        // вызываем addUser из хука из App
        props.addUser(user)
        // обнуляем форму, с помощью setUser функции
        // которая у нас взята из хука в данном компоненте
        setUser(initialFormState)
        setEmails([{ email: '' }])
        setIsShowModal(true)
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
        setUser({ ...user, emails: [...emails.filter((email, index) => index !== key)] })
    }

    return (
        <div>
            <div className="mandatoryField">
                <sup>*</sup> - поле обязательно для заполнения
                <h2>Добавление студента</h2>
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
                <MaskedInput
                    required
                    mask={['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="Введите номер"
                    guide={true}
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                />
                <label>Почта<sup>*</sup></label>
                {
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
                <button disabled={blockButton}>Добавить</button>
                <NavLink to="/students">
                    <button
                        className="button muted-button"
                    >Назад
                </button>
                </NavLink>
            </form>
            {isShowModal && <Modal isCloseModal={isCloseModal} message={'Студент добавлен'} />}
        </div>
    )
}

export { AddUserForm }