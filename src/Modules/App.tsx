import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import ProfilePage from "./ProfilePage";
import ListingDetailsPage from "./ListingDetailsPage";
import TradeScreen from "./TradeScreen";
import TransactionPage from "./TransactionPage";
import PrivateRoute from "../Components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={PrivateRoute(<HomePage />)} />
          <Route path="/profile" element={PrivateRoute(<ProfilePage />)} />
          <Route
            path="/transaction"
            element={PrivateRoute(<TransactionPage />)}
          />
          <Route path="/trade/:id" element={PrivateRoute(<TradeScreen />)} />
          <Route
            path="/listing/:id"
            element={PrivateRoute(<ListingDetailsPage />)}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
