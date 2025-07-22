import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/ceetowers.png";

const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-2xl fixed top-0 left-0 right-0 z-50 ">
      <div className="flex items-center justify-center gap-2">
        <img src={logo} alt="SocietyApp" className="w-14 h-14" />
        <div className="font-greatVibes font-extrabold italic text-6xl text-yellow-400 text-outline">
          Cee Towers
        </div>
      </div>
      <div className="space-x-6">
        <Link to="/about" className="hover:text-yellow-600">
          About
        </Link>
        <Link to="/contact" className="hover:text-yellow-600">
          Contact
        </Link>
        <button
          onClick={() => navigate("/login")}
          className="font-semibold bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
