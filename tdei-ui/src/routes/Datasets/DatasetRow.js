// Represents one dataset row
import React from "react";
import style from "./Datasets.module.css"
import { Badge, Col, Container, Row } from "react-bootstrap";
import datasetRowIcon from "../../assets/img/dataset-row.svg";
import menuOptionIcon from "../../assets/img/menu-options.svg"
import { Link } from "react-router-dom";

const DatasetRow = () => {

    return (
         
        <Container className={style.datasetsTableRow} fluid >
            <Row style={{alignItems:"center",minHeight:'100px'}}>
                <Col md lg="6">
                   
                    <div style={{display:'flex', flexDirection:'row',  alignItems:'center'}}>
                    <div>
                        <img src={datasetRowIcon}/>
                    </div>
                    <div style={{marginLeft:'1rem'}} >
                        <p style={{fontWeight:600, marginBottom:'0px'}}>Lorem ipsum data set name </p>
                        <p style={{color:'#83879B'}}> Version 2.0</p>
                    </div>
                    </div>
                </Col>
                <Col>
                Pathway 
                </Col>
                <Col>
                 25 Mar 2024
                </Col>
                <Col>
                
                 <div style={{backgroundColor:"#B6EDD7", width:'60%',alignContent:'center', textAlign:'center',borderRadius:'15px',border:'1px solid #A9E2CB'}}>
                    Released
                </div>
                 
                </Col>
                <Col>
                    <Link> Inspect </Link>
                </Col>
                <Col>
                   <img src={menuOptionIcon}/>
                </Col>
            </Row>
        </Container>
       
    )
}

export default DatasetRow;