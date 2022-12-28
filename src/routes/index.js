import React from 'react';
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Root from './Root';
import Register from './Register';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path='/register' element={<Register />} />
        </Route>
    )
);

export default router;