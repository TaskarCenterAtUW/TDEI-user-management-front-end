import React, { useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const isIOS = () =>
  /iPad|iPhone|iPod/i.test(navigator.userAgent || '') ||
  (/Macintosh/i.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1);

export default function AppLinkFallback() {
  const ios = isIOS();
  const iosInstall = useMemo(() => process.env.REACT_APP_IOS_INSTALL_URL || '', []);
  const androidInstall = useMemo(() => process.env.REACT_APP_ANDROID_INSTALL_URL || '', []);

  useEffect(() => {
    sessionStorage.setItem('handoffInProgress', '1');
    const clearHandoff = () => {
      sessionStorage.removeItem('handoffInProgress');
    };

    window.addEventListener('focus', clearHandoff);
    const onPageShow = (e) => {
      clearHandoff();
      if (e.persisted) {
        window.location.replace(window.location.href);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    const onVisibility = () => {
      if (!document.hidden) clearHandoff();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', clearHandoff);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const instructionText = ios ? (
    <>If you have the app installed, tap <strong>“Open”</strong> in the banner at the top.</>
  ) : (
    <>If you have the app installed, choose it from the prompt that appears.</>
  );

  const installUrl = ios ? iosInstall : androidInstall;
  const hasInstallUrl = !!installUrl;

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
                If you don’t have the app, you can download it below.
              </Card.Text>

              {!hasInstallUrl && (
                <Alert variant="warning" className="mb-3">
                  App install URL isn’t configured. Please contact support.
                </Alert>
              )}

              <div className="d-grid gap-2">
                {hasInstallUrl && (
                  <Button
                    variant="primary"
                    className="tdei-primary-button"
                    as="a"
                    href={installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ios ? 'Install iOS App (TestFlight)' : 'Install Android App'}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}