import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import MaskedInput from 'react-text-mask'
import Modal from '../Modal'
import { useEffect } from 'react';

const AddUserForm = props => {
    const initialFormState = { id: null, name: '', count: '', status: 'купить' }
    // используем useState и передаем в качестве начального значения объект - initialFormState
    const [user, setUser] = useState(initialFormState)
    const [isShowModal, setIsShowModal] = useState(false)
    const [blockButton, setBlockButton] = useState(true)

    useEffect(() => {
        if (!user.name ||
            !user.count) {
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
        // вызываем addUser из хука из App
        props.addUser(user)
        // обнуляем форму, с помощью setUser функции
        // которая у нас взята из хука в данном компоненте
        setUser(initialFormState)
        setIsShowModal(true)
    }

    return (
        <div>
            <div className="mandatoryField">
                <sup>*</sup> - поле обязательно для заполнения
                <h2>Добавление покупки</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Наименование<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange} />
                <label>Кол-во<sup>*</sup></label>
                <input
                    required
                    type="text"
                    name="count"
                    value={user.count}
                    onChange={handleInputChange} />
                <button disabled={blockButton}>Добавить</button>
                <NavLink to="/purchases">
                    <button
                        className="button muted-button"
                    >Назад
                </button>
                </NavLink>
            </form>
            {isShowModal && <Modal isCloseModal={isCloseModal} message={'Покупка добавлена'} />}
        </div>
    )
}

export { AddUserForm }