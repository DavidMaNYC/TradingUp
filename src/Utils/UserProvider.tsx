import { createContext, ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import { User } from "../Types";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser?: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean; // Add a loading state to the context
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshToken: () => Promise<void>;
}
interface UserProviderProps {
  children: ReactNode;
}
export const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => {
    throw new Error("setCurrentUser function must be overridden");
  },
  loading: true,
  setLoading: () => {
    throw new Error("setLoading function must be overridden");
  },
  refreshToken: async () => {
    throw new Error("refreshToken function must be overridden");
  },
}); // Initialize loading to true
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const refreshToken = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const freshToken = await firebaseUser.getIdToken(true);
      const freshConfig = {
        headers: { Authorization: `Bearer ${freshToken}` },
      };
      setCurrentUser({ ...currentUser, config: freshConfig } as any);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const uid = firebaseUser.uid;
        const email = firebaseUser.email;
        try {
          // Fetch additional user data from your server (such as username, first name, last name and gender)
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/user/${uid}`,
            config
          );
          const { username, _id, listings, avatar } = response.data;
          const storage = getStorage();
          let formattedAvatar = null;
          if (avatar) {
            const avatarRef = ref(storage, avatar);
            const avatarPath = avatarRef.fullPath; // Get the full path of the avatar
            const avatarURL = await getDownloadURL(avatarRef).catch(
              console.error
            );
            formattedAvatar = { path: avatarPath, url: avatarURL };
          }

          const formattedListings = await Promise.all(
            listings.map(async (listing: { images: string[] }) => {
              const formattedImages = await Promise.all(
                listing.images.map(async (image) => {
                  const imageRef = ref(storage, image);
                  const imagePath = imageRef.fullPath; // Get the full path of the image
                  const downloadURL = await getDownloadURL(imageRef).catch(
                    console.error
                  );
                  return { path: imagePath, url: downloadURL };
                })
              );
              return {
                ...listing,
                images: formattedImages,
              };
            })
          );
          setCurrentUser({
            _id,
            uid,
            email,
            username,
            config,
            listings: formattedListings,
            avatar: formattedAvatar,
          });
        } catch (err) {
          // Error handling for fetching user data
          console.error("Error fetching user data", err);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [loading]);

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading, refreshToken }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};
