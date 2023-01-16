import React, { useState, useRef, useCallback } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import useGetOrganisation from '../../hooks/organisation/useGetOrganisation';
import styles from './OrganisationList.module.css';
import { useInView } from 'react-intersection-observer';
import {debounce} from 'lodash'

const OrganisationList = () => {
    const [searchText, setSearchText] = React.useState('');
    const [pageNo, setPageNo] = React.useState(1);
    const {
        loading, error, orgList, hasMore
    } = useGetOrganisation(searchText, pageNo);

    const observer = useRef()
    const lastOrgListRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNo(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const handleClick = (e) => {
        console.log(e.target.id)
    }

    const handleSearch = (e) => {
        setSearchText(e.target.value)
        setPageNo(1)
      }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }} className={styles.dropdownMenu}>
            Some Text
        </div>

    ));

    // forwardRef again here!
    // Dropdown needs access to the DOM of the Menu to measure it
    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Search Organization"
                        onChange={handleSearch}
                        value={searchText}
                    />
                    <div className={styles.dropdownList}>
                        {children}
                    </div>
                </div>
            );
        },
    );

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            </Dropdown.Toggle>
            <Dropdown.Menu as={CustomMenu}>
                {orgList.map((val, index) => {
                    if (orgList.length === index + 1) {
                        return <Dropdown.Item id={val.id} onClick={handleClick} ref={lastOrgListRef} key={val.id}>{val.name}</Dropdown.Item>
                    } else {
                        return <Dropdown.Item id={val.id} onClick={handleClick} key={val.id}>{val.name}</Dropdown.Item>
                    }
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default OrganisationList