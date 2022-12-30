import React from 'react';
import { Route, Routes } from "react-router-dom";
import Root from './Root';
import Register from './Register';
import LoginPage from './LoginPage';
import RequireAuth from '../components/RequireAuth/RequireAuth';

const Router = () => {
  return (
    <Routes>
      <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={
              <Root />
            }
          />
        </Route>

      </>

    </Routes>
  )
}

export default Router;