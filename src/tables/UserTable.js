import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import Fuse from 'fuse.js'

const UserTable = props => {

    const handleDeleteUser = id => {
        props.deleteUser(id)
    }

    // Поиск/фильтр

    const [searchString, setSearchString] = useState('')
    const [filteredTable, setFilteredTable] = useState(props.users)
    const now = new Date()

    const onChangeSearch = e => {
        const { value } = e.target
        setSearchString(value)
    }

    const filterTable = (table, filter) => {
        if (!filter) return table

        const searchOptions = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 0,
            minMatchCharLength: 1,
            keys: ['specialty', 'group']
        }

        const fuse = new Fuse(table, searchOptions)
        const result = fuse.search(filter)

        return result
    }

    useEffect(() => {
        setFilteredTable(filterTable(props.users, searchString))
    }, [searchString, props.users])

    return (
        <div>
            <input type="text" value={searchString} onChange={onChangeSearch} id="search" placeholder="Поиск..." />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => props.onSort('surname')}>
                            ФИО {props.sortField === 'surname' ? (props.sort === 'asc' ? <small>&uarr;</small> : <small>&darr;</small>) : null}
                        </th>
                        <th>
                            Группа
                        </th>
                        <th>
                            Направление
                        </th>
                        <th colSpan={1}></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable.length > 0 ? (
                        filteredTable.map(user => (
                            <tr key={user.id}>
                                <td data-label="ФИО">{`${user.surname} ${user.name[0]}.${user.patronymic[0]}.`}</td>
                                <td data-label="Группа">{user.group}</td>
                                <td data-label="Направление">{user.specialty}</td>
                                <td>
                                    <NavLink to="/edit-student">
                                        <button
                                            className="button muted-button"
                                            onClick={() => props.editRow(user)}
                                        >&#9998;</button>
                                    </NavLink>
                                    <button
                                        className="button muted-button"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >&#10005;</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                            <tr>
                                <td colSpan={4}>Нет записей</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    )

}

export { UserTable }