
import React, { useState } from 'react';
import style from "./SkipLinks.module.css";
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const SkipLinks = () => {

    const { user } = useAuth();
    const authenticated = !!user?.name;

    return (
        <>
            {authenticated && ( 
                <>
                    <a href="#sidebar" className={style.skipLink}>
                        Skip to navigation
                    </a>
                    <a href="#main-content" className={style.skipLink}>
                        Skip to main content
                    </a>
                </>
            )}
        </>
    );
};

export default SkipLinks;
