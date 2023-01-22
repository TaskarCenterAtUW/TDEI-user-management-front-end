import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import clsx from 'clsx';

import style from "./Dropdown.module.css";

const Icon = () => {
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
    );
};

const Dropdown = ({
    placeHolder,
    options,
    isSearchable,
    onChange,
    onSearchText,
    searchText,
    setSearchText,
    lastOrgListRef,
    loading
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const searchRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        setSearchText("");
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMenu]);

    useEffect(() => {
        const handler = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        window.addEventListener("click", handler);
        return () => {
            window.removeEventListener("click", handler);
        };
    });
    const handleInputClick = (e) => {
        setShowMenu(!showMenu);
    };

    const getDisplay = () => {
        if (!selectedValue || selectedValue.length === 0) {
            return placeHolder;
        }
        return selectedValue.name;
    };

    const onItemClick = (option) => {
        setSelectedValue(option);
        onChange(option);
    };

    const isSelected = (option) => {

        if (!selectedValue) {
            return false;
        }

        return selectedValue.name === option.name;
    };

    const onSearch = (e) => {
        setSearchText(e.target.value);
        onSearchText(e.target.value);
    };

    return (
        <div className={style.dropdownContainer}>
            <div ref={inputRef} onClick={handleInputClick} className={style.dropdownInput}>
                <div className={style.dropdownSelectedValue}>{getDisplay()}</div>
                <div className={style.dropdownTools}>
                    <div className={style.dropdownTool}>
                        <Icon />
                    </div>
                </div>
            </div>
            {showMenu && (
                <div className={style.dropdownMenu}>
                    {isSearchable && (
                        <div className={style.searchBox}>
                            <input className={style.searchInput} onChange={onSearch} value={searchText} ref={searchRef} placeholder="Search Organization" />
                        </div>
                    )}
                    <div className={style.listContainer}>
                        {options.map((option, index) => {
                            if (options.length === index + 1) {
                                return <div
                                    onClick={() => onItemClick(option)}
                                    key={option.id}
                                    className={clsx(style.dropdownItem, [isSelected(option) && style.selected])}
                                    ref={lastOrgListRef}
                                >
                                    {option.name}
                                </div>
                            } else {
                                return <div
                                    onClick={() => onItemClick(option)}
                                    key={option.id}
                                    className={clsx(style.dropdownItem, [isSelected(option) && style.selected])}
                                >
                                    {option.name}
                                </div>
                            }
                        })}
                        {loading ? <div className='d-flex justify-content-center'><Spinner size='sm' /></div> : null}
                        {options.length === 0 && !loading ? <div> No data present </div> : null}
                    </div>

                </div>
            )}
        </div>
    );
};

export default Dropdown;
