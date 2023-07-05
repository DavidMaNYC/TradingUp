import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { ReactElement } from "react"; // Import ReactElement type
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Utils/firebase";

const PrivateRoute = (element: ReactElement<{ children: React.ReactNode }>) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />; // Replace this with your actual loading component or indicator
  }

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
