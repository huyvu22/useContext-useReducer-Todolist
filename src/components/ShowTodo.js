import React, { useContext, useState, useEffect, useReducer } from 'react'
import { AppContext } from '../Context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalShowEditTodo from './ModalShowEditTodo';
import Filter from './Filter';
import Pagination from './Pagination';
import config from '../components/Configs/config.json'

const { PER_PAGE, SERVER_API } = config

const ShowTodo = () => {
    const { listTodo, getData, } = useContext(AppContext)

    const initialState = {
        todo: '',
        showModal: false,
        dataUpdate: {},
        change: false,
        page: 1,
        pageCount: 1
    }

    const [checked, setChecked] = useState(false);

    const ShowReducer = (state, action) => {
        switch (action.type) {
            case 'SET_INPUT':
                return {
                    ...state,
                    todo: action.payload,
                };
            case 'ADD_TODO':
                return {
                    ...state,
                    todo: '',
                }
            case 'SHOW_MODAL_EDIT':
                return {
                    ...state,
                    showModal: true,
                    dataUpdate: action.dataUpdate,
                    change: !initialState.change
                }
            case 'CLOSE_MODAL_EDIT':
                return {
                    ...state,
                    showModal: false,
                    change: !initialState.change
                }
            case 'RESET_DATA_UPDATE':
                return {
                    ...state,
                    dataUpdate: {},
                    change: !initialState.change
                }
            case 'GET_TOTAL_PAGE':
                return {
                    ...state,
                    pageCount: action.pageCount,
                }
            default:
                throw new Error('Unexpected Action')
        }
    }

    const [showState, showDispatch] = useReducer(ShowReducer, initialState)

    const handleAddTodo = (e) => {
        e.preventDefault()
        if (showState.todo.length) {
            postData()
            showDispatch({
                type: 'ADD_TODO',
            })
        }
    }

    const postData = async () => {

        if (showState.todo !== '') {
            const todos = {
                name: showState.todo,
                isCompleted: false,
                id: uuidv4()
            }
            const res = await fetch(SERVER_API, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todos)
            })
            let data = await res.json()
            if (data) {
                setChecked(!checked)
            }
        }
    }

    const handleChangeValue = (e) => {
        showDispatch({
            type: 'SET_INPUT',
            payload: e.target.value

        })
    }

    const handleEditTodo = (todos) => {
        console.log(showState)
        showDispatch({
            type: 'SHOW_MODAL_EDIT',
            dataUpdate: todos
        })
        console.log(listTodo)
    }

    const handleChecked = async (id, isCompleted) => {

        let res = await fetch(`${SERVER_API}/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isCompleted: !isCompleted })
        })
        let data = await res.json()
        if (data) {
            setChecked(!checked)
        }
    }

    const handleRemove = async (id) => {
        if (window.confirm('Ban chac chan muon xoa')) {
            if (listTodo.data.length) {
                let res = await fetch(`${SERVER_API}/${id}`, {
                    method: 'DELETE',
                })
                toast.success('Xoa thanh cong')
                let data = await res.json()
                if (data) {
                    setChecked(!checked)
                }
            }
        }
    }

    const getTotalPage = async () => {
        let param = '';
        if (listTodo.types !== '') {
            param = param + `isCompleted=${listTodo.types}`
        }
        const res = await fetch(SERVER_API + '?' + param)
        let data = await res.json();
        let pageCount = Math.ceil(data.length / PER_PAGE)

        showDispatch({
            type: 'GET_TOTAL_PAGE',
            pageCount: pageCount
        })
    }

    useEffect(() => {
        getData()
        getTotalPage()
    }, [listTodo.page, listTodo.types, checked])

    return (
        <>
            <div className='d-flex justify-content-center flex-column'>
                <div className='title d-flex justify-content-center'>
                    <div id="myDIV" className="header">
                        <form action="" type='submit' onSubmit={(e) => handleAddTodo(e)}>
                            <h2>My To Do List</h2>
                            <input style={{ borderRadius: '5px' }} autoFocus type="text" id="myInput" placeholder="Todo..." onChange={(e) => handleChangeValue(e)} value={showState.todo} />
                            <hr />
                        </form>
                        <br />
                        <Filter getTotalPage={getTotalPage} />
                    </div></div>
                <div className='todos d-flex justify-content-center '>
                    {
                        listTodo.data.length ?
                            <ul id="myUL">
                                {
                                    listTodo.data && listTodo.data.length &&
                                    listTodo.data.map((item) => {
                                        return <li key={item.id} className={`${item.isCompleted ? 'checked' : null}`}>
                                            <span onClick={() => handleChecked(item.id, item.isCompleted)}>{item.name}</span>
                                            <span className="close" onClick={() => { handleRemove(item.id) }}>×</span>
                                            <span className="close edit" value={showState.todo} onClick={() => { handleEditTodo(item) }}>Edit</span>
                                        </li>
                                    })

                                }
                            </ul>
                            :
                            <h3>No Todo Found</h3>
                    }

                </div>
                <div >
                    {listTodo.data && listTodo.data.length ?
                        <Pagination showState={showState} /> :
                        <p></p>
                    }
                </div>
                <ToastContainer />
                <ModalShowEditTodo handleEditTodo={handleEditTodo} showState={showState} showDispatch={showDispatch} setChecked={setChecked} checked={checked} />
            </div>

        </>
    )
}

export default ShowTodo