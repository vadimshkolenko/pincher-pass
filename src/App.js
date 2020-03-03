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

    const initialFormState = { id: null, name: '', count: '', status: 'купить' }
    const [currentUser, setCurrentUser] = useState(initialFormState)

    const addUser = user => {

        if (users.length > 0) {
            user.id = users[users.length - 1].id + 1
        } else user.id = 1

        db.collection("usersData").doc(`${user.id}`).set({
            id: user.id,
            name: user.name,
            count: user.count,
            status: user.status,
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
            count: updatedUser.count,
            status: updatedUser.status,
        })
    }

    const editRow = user => {
        setEditing(true)
        setCurrentUser({
            id: user.id,
            name: user.name,
            count: user.count,
            status: user.status,
        })
    }

    // Сортировка
    const [sortConfig, setSortConfig] = useState({ sort: 'asc', sortField: 'status' })

    const onSort = sortField => {
        const cloneData = users.concat() // чтобы не менялся state.data в состоянии компонента
        const sortType = sortConfig.sort === 'asc' ? 'desc' : 'asc'
        // const test = _.groupBy(cloneData, sortField, sortType)
        const orderedData = _.orderBy(cloneData, sortField, sortType) //передаем копию нашего массива, поле по которому мы сортируем и направление - sortType 

        // const orderedData = _.orderBy(test, sortField, sortType) //передаем копию нашего массива, поле по которому мы сортируем и направление - sortType 

        setUsers(orderedData)
        setSortConfig({ sort: sortType, sortField })
    }

    return (
        <div>
            <header>
                <h1>pincher</h1>
                <nav>
                    <NavLink exact to="/" activeClassName="activeLink">Главная</NavLink>
                    <NavLink to="/purchases" activeClassName="activeLink">Покупки</NavLink>
                    <NavLink to="/add-purchase" activeClassName="activeLink">Добавить покупку</NavLink>
                </nav>
            </header>
            <Route exact path="/" render={() => <Information />}
            />
            <Route exact path="/add-purchase" render={() =>
                <AddUserForm addUser={addUser} />}
            />
            <Route exact path="/edit-purchase" render={() =>
                <EditUserForm
                    editing={editing}
                    setEditing={setEditing}
                    currentUser={currentUser}
                    updateUser={updateUser}
                    deleteUser={deleteUser}
                />}
            />
            <Route exact path="/purchases" render={() =>
                <UserTable
                    users={users}
                    deleteUser={deleteUser}
                    updateUser={updateUser}
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