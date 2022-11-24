import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react'
import config from '../components/Configs/config.json'

const { SERVER_API } = config

const ModalShowEditTodo = ({ showState, showDispatch, checked, setChecked }) => {

    const handleClose = () => {
        showDispatch({
            type: 'CLOSE_MODAL_EDIT'
        })
        setNewname('')
        showDispatch({
            type: 'RESET_DATA_UPDATE'
        })
    };

    const [newname, setNewname] = useState('');

    useEffect(() => {
        setNewname(showState.dataUpdate.name);
    }, [showState.dataUpdate, checked])

    const handleSaveUpdate = async () => {
        let res = await fetch(`${SERVER_API}/${showState.dataUpdate.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newname })
        })

        showDispatch({
            type: 'CLOSE_MODAL_EDIT'
        })
        let data = await res.json()
        if (data) {
            setChecked(!checked)
        }
    }
    return (
        <>
            <Modal
                show={showState.showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label><h5>Title</h5></label>
                    <input autoFocus type="text" id="myInput" value={newname} onChange={(e) => setNewname(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSaveUpdate()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalShowEditTodo