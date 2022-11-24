import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { AppContext } from '../Context/AppContext';

const Filter = (props) => {
    let { listTodo, dataDispatch, getData } = useContext(AppContext)

    const options = [
        { value: "", label: "ALL" },
        { value: "true", label: "COMPLETE" },
        { value: "false", label: "INCOMPLETE" },
    ];
    const handleFilter = (e) => {
        dataDispatch({
            type: 'GET_DATA_FILTER',
            types: e.value
        })

    }
    useEffect(() => {
        getData()
        props.getTotalPage()
    }, [listTodo.types])
    return (
        <div style={{ color: "#000", cursor: 'pointer', width: '50%' }}>
            <Select
                options={options}
                defaultValue={{ label: "ALL", value: 'ALL' }}
                onChange={(e) => handleFilter(e)}
            />
        </div>
    );
};

export default Filter;
