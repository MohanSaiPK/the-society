import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/ceetowers.png";

const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-2xl fixed top-0 left-0 right-0 z-50 ">
      <div className="flex items-center justify-center gap-2">
        <img src={logo} alt="SocietyApp" className="md:w-14 md:h-14 w-10" />
        <div className="font-greatVibes font-extrabold italic md:text-6xl text-yellow-400 text-outline">
          Cee Towers
        </div>
      </div>
      <div className="md:space-x-6 space-x-2">
        <Link
          to="/about"
          className="hover:text-yellow-600 text-sm md:text-base"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="hover:text-yellow-600 text-sm md:text-base"
        >
          Contact
        </Link>
        <button
          onClick={() => navigate("/login")}
          className="font-semibold bg-yellow-400 text-black text-xs md:text-base px-2 md:px-4 py-2 md:py-2 rounded-md hover:bg-yellow-500 transition-colors"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
