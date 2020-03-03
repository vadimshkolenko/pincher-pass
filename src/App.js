import React, { useState, useEffect } from 'react'
import { AddUserForm } from './forms/AddUserForm'
import { UserTable } from './tables/UserTable'
import { EditUserForm } from './forms/EditUserForm'
import { Information } from './Information'
import './App.css'
import { Route, NavLink } from 'react-router-dom';
import './firebaseConfig/firebaseConfig'
import * as firebase from 'firebase'
import _ from 'lodash'



const App = () => {
    const db = firebase.firestore()

    const [users, setUsers] = useState([])

    useEffect(() => {
        db.collection("usersData").onSnapshot(snapshot => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(_.orderBy(usersData, sortConfig.sortField, 'asc'))
        })
    }, [])

    const [editing, setEditing] = useState(false)

    const initialFormState = { id: null, name: '', surname: '', patronymic: '', birth: '', phone: '', emails: '', specialty: '', group: '' }
    const [currentUser, setCurrentUser] = useState(initialFormState)

    const addUser = user => {

        if (users.length > 0) {
            user.id = users[users.length - 1].id + 1
        } else user.id = 1

        db.collection("usersData").doc(`${user.id}`).set({
            id: user.id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            birth: user.birth,
            phone: user.phone,
            emails: user.emails,
            specialty: user.specialty,
            group: user.group
        })
    }

    const deleteUser = id => {
        setEditing(false)
        setUsers(users.filter(user => user.id !== id))
        db.collection("usersData").doc(`${id}`).delete()
    }

    const updateUser = (id, updatedUser) => {
        setEditing(false)
        setUsers(users.map(user => (user.id === id ? updatedUser : user)))
        db.collection("usersData").doc(`${id}`).update({
            id: updatedUser.id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            patronymic: updatedUser.patronymic,
            birth: updatedUser.birth,
            phone: updatedUser.phone,
            emails: updatedUser.emails,
            specialty: updatedUser.specialty,
            group: updatedUser.group
        })
    }

    const editRow = user => {
        setEditing(true)
        setCurrentUser({
            id: user.id,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            birth: user.birth,
            phone: user.phone,
            emails: user.emails,
            specialty: user.specialty,
            group: user.group
        })
    }

    // Сортировка
    const [sortConfig, setSortConfig] = useState({ sort: 'asc', sortField: 'surname' })

    const onSort = sortField => {
        const cloneData = users.concat() // чтобы не менялся state.data в состоянии компонента
        const sortType = sortConfig.sort === 'asc' ? 'desc' : 'asc'
        const orderedData = _.orderBy(cloneData, sortField, sortType) //передаем копию нашего массива, поле по которому мы сортируем и направление - sortType 

        setUsers(orderedData)
        setSortConfig({ sort: sortType, sortField })
    }

    return (
        <div>
            <header>
                <h1>shkolenko185</h1>
                <nav>
                    <NavLink exact to="/" activeClassName="activeLink">Главная</NavLink>
                    <NavLink to="/students" activeClassName="activeLink">Студенты</NavLink>
                    <NavLink to="/add-student" activeClassName="activeLink">Добавить студента</NavLink>
                </nav>
            </header>
            <Route exact path="/" render={() => <Information />}
            />
            <Route exact path="/add-student" render={() =>
                <AddUserForm addUser={addUser} />}
            />
            <Route exact path="/edit-student" render={() =>
                <EditUserForm
                    editing={editing}
                    setEditing={setEditing}
                    currentUser={currentUser}
                    updateUser={updateUser}
                    deleteUser={deleteUser}
                />}
            />
            <Route exact path="/students" render={() =>
                <UserTable
                    users={users}
                    deleteUser={deleteUser}
                    editRow={editRow}
                    onSort={onSort}
                    sort={sortConfig.sort}
                    sortField={sortConfig.sortField}
                />}
            />
        </div>
    )
}

export { App }