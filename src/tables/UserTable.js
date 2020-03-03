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

  const statusChange = (event) => {
    // event.preventDefault()
    // if (event.target.value.status === 'не куплено') {
    //     event.target.value.status = 'куплено'
    // } else {
    //     event.target.value.status = 'не куплено'
    // }
  }

  const colorStatus = (status) => {
    if (status === 'куплено') {
      return { backgroundColor: 'green' }
    } else return { backgroundColor: 'white' }
  }

  // const onChangeSearch = e => {
  //   const { value } = e.target
  //   setSearchString(value)
  // }

  // const filterTable = (table, filter) => {
  //   if (!filter) return table

  //   const searchOptions = {
  //     shouldSort: true,
  //     threshold: 0.6,
  //     location: 0,
  //     distance: 100,
  //     maxPatternLength: 0,
  //     minMatchCharLength: 1,
  //     keys: ['specialty', 'group']
  //   }

  //   // const fuse = new Fuse(table, searchOptions)
  //   // const result = fuse.search(filter)

  //   // return result
  // }

  // useEffect(() => {
  //   setFilteredTable(filterTable(props.users, searchString))
  // }, [searchString, props.users])

  return (
    <div>
      {/* <input type="text" value={searchString} onChange={onChangeSearch} id="search" placeholder="Поиск..." /> */}
      <table>
        <thead>
          <tr>
            <th onClick={() => props.onSort('name')}>
              Наименование {props.sortField === 'name' ? (props.sort === 'asc' ? <small>&uarr;</small> : <small>&darr;</small>) : null}
            </th>
            <th>
              Кол-во
            </th>
            <th onClick={() => props.onSort('status')}>
              Статус
            </th>
            <th colSpan={1}></th>
          </tr>
        </thead>
        <tbody>
          {props.users.length > 0 ? (
            props.users.map(user => (
              <tr key={user.id} style={colorStatus(user.status)}>
                <td data-label="Наименование">{user.name}</td>
                <td data-label="Кол-во">{user.count}</td>
                <td data-label="Статус">
                  <input
                    type="button"
                    value={user.status}
                    onClick={(event) => {
                      event.preventDefault()
                      if (event.target.value === 'купить') {
                        event.target.value = 'куплено'
                        props.updateUser(user.id, { ...user, status: event.target.value })
                      } else {
                        event.target.value = 'купить'
                        props.updateUser(user.id, { ...user, status: event.target.value })
                      }
                    }
                    }
                  />
                </td>
                <td>
                  <NavLink to="/edit-purchase">
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