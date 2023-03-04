import React from 'react'
import Container from '../../components/Container/Container'
import Layout from '../../components/Layout'
import style from './Services.module.css'
import newWindowIcon from '../../assets/img/new-window-icon.svg'
import { Button } from 'react-bootstrap'
import CreateService from '../../components/CreateService/CreateService'

const Services = () => {
    const [showCreateService, setShowCreateService] = React.useState(false);
    return (
        <Layout>
            <div className={style.header}>
                <div className={style.title}>
                    <div className="page-header-title">SERVICE</div>
                    <div className="page-header-subtitle">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
                    </div>
                </div>
            </div>
            <Container>
                <div className={style.insideContainer}>
                    <div className="page-header-title" style={{ paddingBottom: '22px' }}>Add New Service for Organization</div>
                    <div className="page-header-subtitle" style={{ paddingBottom: '40px', textAlign: 'center' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since</div>
                    <div style={{ paddingBottom: '40px' }}><img src={newWindowIcon} alt="new-window-icon" /></div>
                    <Button onClick={() => setShowCreateService(true)} className="tdei-primary-button">
                        Create New Service
                    </Button>
                </div>
            </Container>
            <CreateService
                show={showCreateService}
                onHide={() => setShowCreateService(false)}
            />
        </Layout>
    )
}

export default Services