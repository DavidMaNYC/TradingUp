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
import TransactionDetailPage from "./TransactionDetailPage";
import ProfileDetailsPage from "./ProfileDetailsPage";
import CounterOfferPage from "./CounterOfferPage";
import { ToastContainer } from "react-toastify";
import MessageList from "./MessageList";
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
          <Route path="/messages/*" element={PrivateRoute(<MessageList />)} />
          <Route
            path="/profile/:userId"
            element={PrivateRoute(<ProfileDetailsPage />)}
          />
          <Route
            path="/transaction"
            element={PrivateRoute(<TransactionPage />)}
          />
          <Route
            path="/transaction/:offerId"
            element={PrivateRoute(<TransactionDetailPage />)}
          />
          <Route
            path="/trade/:userId"
            element={PrivateRoute(<TradeScreen />)}
          />
          <Route
            path="/counter/:offerId"
            element={PrivateRoute(<CounterOfferPage />)}
          />
          <Route
            path="/listing/:listingId"
            element={PrivateRoute(<ListingDetailsPage />)}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
