import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const isIOS = () =>
    /iPad|iPhone|iPod/i.test(navigator.userAgent || "") ||
    (/Macintosh/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 1);

export default function AppLinkFallback() {
    const instructionText = isIOS() ? (
        <>
            If you have the app installed, please tap <strong>"Open"</strong> in the banner at the top of your screen.
        </>
    ) : (
        <>
            If you have the app installed, please choose it from the prompt that appears on your screen.
        </>
    );

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="text-center">
                        <Card.Header as="h5">Continue in our App</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {instructionText}
                                <br />
                                If you don't have the app, you can download it below.
                            </Card.Text>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
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

