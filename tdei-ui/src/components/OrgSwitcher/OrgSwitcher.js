import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import useGetOrgRoles from '../../hooks/roles/useOrgRoles';
import { set } from '../../store';
import style from './OrgSwitcher.module.css'

const OrgSwitcher = () => {
    const { data } = useGetOrgRoles();
    const dispatch = useDispatch();
    const [selected, setSelected] = React.useState(null)
    React.useEffect(() => {
        if (data?.length) {
            setSelected(data?.[0]);
        }
    }, [data])

    const handleOrgSelection = (index) => {
        setSelected(data?.[index]);
        dispatch(set(data?.[index]));
    }

    return (
        <>
            {data?.length ? <Dropdown className={style.customDropdown} align="end">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {selected?.orgName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Header>Switch Organization</Dropdown.Header>
                    {data?.map((val, index) => <Dropdown.Item key={val.orgName} onClick={() => handleOrgSelection(index)} active={val.orgName === selected?.orgName}>{val.orgName}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown> : null}
        </>

    )
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className={style.customElement}
    >
        {children}
        <span data-arrow='downArrow'>&#x25bc;</span>
        <span data-arrow='upArrow'>&#x25B2;</span>
    </div>
));

export default OrgSwitcher