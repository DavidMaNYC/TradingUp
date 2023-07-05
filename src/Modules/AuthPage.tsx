import {
  useState,
  FormEvent,
  useEffect,
  useContext,
  CSSProperties,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Utils/firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserContext } from "../Utils/UserProvider";

function AuthPage() {
  const { setCurrentUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, []);

  if (loading) {
    return <></>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        if (password !== confirmPassword) {
          // Passwords don't match, handle the error accordingly
          throw new Error("Passwords do not match");
        }
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        setCurrentUser?.({
          uid: user?.uid,
          email: user?.email,
          username,
          listings: [],
        });
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user`, {
          uid: user?.uid,
          email: user?.email,
          username,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      navigate("/home");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "Something went wrong. Please try again.";

      switch (firebaseError.code) {
        case "auth/wrong-password":
          // Custom message for wrong password
          errorMessage = "Incorrect password, please try again.";
          break;

        case "auth/user-not-found":
          // Custom message for user not found
          errorMessage = "No user found with this email. Please sign up.";
          break;

        case "auth/invalid-email":
          // Custom message for invalid email
          errorMessage = "Invalid email, please check and try again.";
          break;

        case "auth/email-already-in-use":
          // Custom message for email already in use
          errorMessage = "Email already in use. Please try another one.";
          break;

        case "auth/user-disabled":
          // Custom message for user disabled
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;

        case "auth/operation-not-allowed":
          // Custom message for operation not allowed
          errorMessage = "Operation not allowed. Please contact support.";
          break;

        case "auth/weak-password":
          // Custom message for weak password
          errorMessage =
            "Your password is too weak. Please choose a stronger one.";
          break;

        default:
          // This will cover any other error codes from Firebase Authentication
          errorMessage = firebaseError.message;
          break;
      }

      // Show the toast with the appropriate message
      toast.error(errorMessage);

      // Log the error for debugging
      console.error(firebaseError);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100svh",
        width: "100vw",
      }}
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        {isSignUp && (
          <>
            <input
              style={inputStyle}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </>
        )}
        <input
          style={inputStyle}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {isSignUp && (
          <>
            <input
              style={inputStyle}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </>
        )}
        <button style={buttonStyle} type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <div style={{ textAlign: "center" }}>
          {isSignUp ? (
            <span style={{ color: "black" }}>
              Already have an account?
              <Link
                to="/login"
                onTouchStart={() => setIsSignUp(false)}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </Link>
            </span>
          ) : (
            <span style={{ color: "black" }}>
              Don't have an account?
              <Link
                style={{ marginLeft: "5px" }}
                to="/login"
                onTouchStart={() => {
                  setEmail("");
                  setPassword("");
                  setIsSignUp(true);
                }}
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setIsSignUp(true);
                }}
              >
                Sign Up
              </Link>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default AuthPage;

const inputStyle = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
};
const mobileMediaQuery = "@media (maxWidth: 768px)";
const formStyle: CSSProperties & { [key: string]: any } = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  padding: "20px",
  border: "1px solid #333",
  borderRadius: "5px",
  background: "#E7E9EB",
  [mobileMediaQuery]: {
    // New media query for mobile devices
    width: "90%", // Reduce the width on smaller screens
  },
};
