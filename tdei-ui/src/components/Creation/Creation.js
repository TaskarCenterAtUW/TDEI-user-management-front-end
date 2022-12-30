import React from 'react'
import style from './Creation.module.css'
import { Button } from 'react-bootstrap'
import AssignPoc from '../AssignPoc/AssignPoc'
import CreateOrganisation from '../CreateOrganisation/CreateOrganisation'
import CreateService from '../CreateService/CreateService'
import CreateStation from '../CreateStation/CreateStation'

const Creation = () => {
    const [showCreateOrganisation, setShowCreateOrganisation] = React.useState(false);
    const [showCreateService, setShowCreateService] = React.useState(false);
    const [showCreateStation, setShowCreateStation] = React.useState(false);
    return (
        <div className={`${style.container} p-3`}>
            <h3 className='mb-4'>CREATION</h3>
            <div className={style.buttonWrapper}>
                <Button onClick={() => setShowCreateOrganisation(true)}>ORGANISATION</Button>
                <Button onClick={() => setShowCreateService(true)}>SERVICE</Button>
                <Button onClick={() => setShowCreateStation(true)}>STATION</Button>
            </div>
            <AssignPoc />
            <CreateOrganisation show={showCreateOrganisation} onHide={() => setShowCreateOrganisation(false)} />
            <CreateService show={showCreateService} onHide={() => setShowCreateService(false)} />
            <CreateStation show={showCreateStation} onHide={() => setShowCreateStation(false)} />
        </div>
    )
}

export default Creation