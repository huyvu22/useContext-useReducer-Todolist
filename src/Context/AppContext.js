import React from 'react'
import { useReducer } from 'react';
import { createContext, useEffect } from 'react';
import config from '../components/Configs/config.json'

export const AppContext = createContext({});
const { PER_PAGE, SERVER_API } = config

export const AppProvider = ({ children }) => {
    const initialState = {
        isLoading: false,
        data: [],
        error: null,
        types: '',
        page: 1,
    }

    const dataReducer = (state, action) => {
        switch (action.type) {
            case 'GET_DATA':
                return {
                    ...state,
                    isLoading: true
                }
            case 'GET_DATA_SUCCESS':
                return {
                    ...state,
                    isLoading: false,
                    data: action.data,
                    pageCount: action.pageCount
                }
            case 'GET_DATA_ERROR':
                return {
                    ...state,
                    data: [],
                }
            case 'GET_DATA_FILTER':
                return {
                    ...state,
                    types: action.types
                }
            case 'GET_PAGE':
                return {
                    ...state,
                    page: action.page,
                }
            default:
                throw new Error('Unexpected Action')
        }
    }

    const [listTodo, dataDispatch] = useReducer(dataReducer, initialState)

    const getData = async () => {

        let param = `_page=${listTodo.page}&_limit=${PER_PAGE}`

        if (listTodo.types !== '') {
            param = param + `&isCompleted=${listTodo.types}`
            if (listTodo.page > 1) {
                param = `_page=${listTodo.page}&_limit=${PER_PAGE}$&isCompleted=${listTodo.types}`
            }
        }
        const res = await fetch(SERVER_API + '?' + param)
        dataDispatch({
            type: 'GET_DATA'
        });
        let data = await res.json();
        dataDispatch({
            type: 'GET_DATA_SUCCESS',
            data: data,
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return <AppContext.Provider value={{ listTodo, dataDispatch, getData }} >
        {children}
    </AppContext.Provider>
}

