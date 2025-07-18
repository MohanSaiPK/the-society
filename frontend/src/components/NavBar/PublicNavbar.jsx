import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bcaa.png";

const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <img src={logo} alt="SocietyApp" className="w-10 h-10" />
        <div className="text-xl font-bold">SocietyApp</div>
      </div>
      <div className="space-x-6">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <button
          onClick={() => navigate("/login")}
          className="font-semibold bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
