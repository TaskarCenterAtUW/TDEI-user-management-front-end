// Actions that can be done on a dataset table are put up here.

import { Button, Col, Container, InputGroup, Row } from "react-bootstrap"
import { Form } from "react-bootstrap";

import { BsSearch,BsArrowCounterclockwise ,BsSortDown } from "react-icons/bs";

const DatasetsActions = () => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <InputGroup className="mb-3">

                        <Form.Control
                            placeholder="Search Datasets"
                            aria-label="Search Datasets"
                            aria-describedby="basic-addon1"

                        />
                        <InputGroup.Text id="basic-addon1">
                            <BsSearch />
                        </InputGroup.Text>


                    </InputGroup>


                </Col>
                <Col>
                    <Row>
                        <Col>
                            Type
                        </Col>
                        <Col>
                            <Form.Select aria-label="Type selection">
                                <option>All </option>
                                <option value="flex">Flex</option>
                                <option value="pathways">Pathways</option>
                                <option value="osw">OSW</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
                <Col>
                </Col>
                <Col>
                {/* <Row>
                    <Col>
                    <Button variant="secondary">
                    <BsArrowCounterclockwise />
                </Button>
                    </Col>
                    
                    <Col>
                    Sort by
                    </Col>
                    <Col>
                    <BsSortDown />
                    </Col>
                </Row> */}
               
                </Col>
            </Row>
        </Container>
    )
}

export default DatasetsActions;