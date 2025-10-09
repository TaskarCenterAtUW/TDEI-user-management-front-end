import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const isIOS = () =>
    /iPad|iPhone|iPod/i.test(navigator.userAgent || "") ||
    (/Macintosh/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 1);

export default function AppLinkFallback() {

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="text-center">
                        <Card.Header as="h5">App Not Installed</Card.Header>
                        <Card.Body>
                            <Card.Title>Please install our app to continue.</Card.Title>
                            <Card.Text>
                                It looks like you don't have our app installed. Please download it from the appropriate store to view this content.
                            </Card.Text>
                            <div className="d-grid gap-2">
                                <Button
                                    type="submit" variant="primary" 
                                    className="tdei-primary-button"
                                    as="a"
                                    href={isIOS()
                                        ? process.env.REACT_APP_IOS_INSTALL_URL
                                        : process.env.REACT_APP_ANDROID_INSTALL_URL
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {isIOS() ? "Install iOS App (TestFlight)" : "Install Android App"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

