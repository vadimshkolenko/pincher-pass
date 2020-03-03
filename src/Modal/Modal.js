import React from 'react'
import styles from './Modal.module.css'

const Modal = (props) => {

    window.addEventListener("keydown", function (event) {
        if (event.keyCode === 27) {
            event.preventDefault()
            props.isCloseModal(false)
        }
    })

    return (
        <div className={styles.modal} onClick={() => props.isCloseModal(false)}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={() => props.isCloseModal(false)}>&#215;</button>
                <div className={styles.text}>{props.message}</div>
            </div>
        </div>
    )
}

export default Modal