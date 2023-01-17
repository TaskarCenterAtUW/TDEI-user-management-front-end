import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Navigation from '../../components/Navigation/Navigation';
import UserHeader from '../../components/UserHeader/UserHeader';
import Creation from '../../components/Creation/Creation';
import style from './style.module.css'
import useGetOrgRoles from '../../hooks/roles/useOrgRoles';
import { getSelectedOrg } from '../../selectors';
import { useDispatch, useSelector } from 'react-redux';
import { set } from '../../store';

const Root = () => {
    const { data: orgData, isLoading: isOrgLoading, isError } = useGetOrgRoles();
    const dispatch = useDispatch()
    const selectedOrg = useSelector(getSelectedOrg);
    React.useEffect(() => {
        if (orgData?.length) {
            dispatch(set(orgData[0]));
        }
    }, [orgData, dispatch])
    const roles = selectedOrg?.roles;
    return (
        <Container fluid className='p-0'>
            {isError ? <div>Error in getting roles</div> : null}
            {(isOrgLoading && !roles) ? <div className='d-flex justify-content-center'><Spinner size='lg' /></div> : <div className='d-flex'>
                <div className={style.navigationBlock}>
                    <Navigation />
                </div>
                <div className={style.contentBlock}>
                    <UserHeader roles={roles} />
                    <Creation roles={roles}/>
                </div>
            </div>}

        </Container>
    )
};

export default Root;