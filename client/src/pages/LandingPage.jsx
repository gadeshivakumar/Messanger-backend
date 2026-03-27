import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import "../styles/landingpage.css";
import Loader from "../components/Loader";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1 className="app-title">Hi!!</h1>
        <p className="app-tagline">Connect. Chat. Enjoy.</p>

        <div className="button-group">
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
          <Link to="/register" className="btn btn-register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}