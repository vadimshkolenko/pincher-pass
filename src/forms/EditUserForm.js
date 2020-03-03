import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import Modal from '../Modal'

const EditUserForm = props => {
    // в качестве начального аргумента передаем
    // пользователя, которого собираемся редактировать
    const [user, setUser] = useState(props.currentUser)

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
        const { name, value } = event.target

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()
        props.updateUser(user.id, user)
        setIsShowModal(true)
    }

    const handleDeleteUser = id => {
        props.deleteUser(id)
    }

    return (
        <div>
            <div className="mandatoryField">
                <sup>*</sup> - поле обязательно для заполнения
                <h2>Редактирование данных</h2>
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
                <button onClick={() => setIsShowModal(true)} disabled={blockButton}>Сохранить</button>

                <NavLink to="/purchases">
                    <button
                        className="button muted-button"
                        onClick={() => handleDeleteUser(user.id)}
                    >Удалить</button>
                </NavLink>

                <NavLink to="/purchases">
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