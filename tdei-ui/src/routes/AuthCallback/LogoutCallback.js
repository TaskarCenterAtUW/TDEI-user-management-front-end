import React from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import style from "../LoginPage/style.module.css";

const LogoutCallback = () => {
  const { signout } = useAuth();
  const completed = React.useRef(false);

  React.useEffect(() => {
    if (completed.current) return;
    completed.current = true;
    signout();
  }, [signout]);

  return (
    <div className={style.loginContainer}>
      <div
        className="d-flex flex-column justify-content-center align-items-center pt-5"
        aria-live="polite"
      >
        <Spinner animation="border" role="status" />
        <p className="mt-3">Signing you out...</p>
      </div>
    </div>
  );
};

export default LogoutCallback;
