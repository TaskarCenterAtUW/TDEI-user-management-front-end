import React from 'react';
import { Container, Row , Col} from 'react-bootstrap';
import Navigation from '../../components/Navigation/Navigation';
import UserHeader from '../../components/UserHeader/UserHeader';
import Creation from '../../components/Creation/Creation';

const Root = () => {
    return (
        <Container fluid>
            <Row>
                <Col sm="2"><Navigation /></Col>
                <Col sm="10">
                    <UserHeader />
                    <Creation />
                </Col>
            </Row>
        </Container>
    )
};

export default Root;