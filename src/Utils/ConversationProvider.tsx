import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { firestore } from "./firebase";
import { UserContext } from "./UserProvider";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";
import axios from "axios";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface Conversation {
  id: string;
  participants: any[];
  messages: any[];
  // additional properties as needed...
}

interface ConversationsContextProps {
  conversations: Conversation[];
  sendMessage: (message: string, recipientId: string) => void;
}

export const ConversationsContext = createContext<ConversationsContextProps>({
  conversations: [],
  sendMessage: () => Promise<void>,
});

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const fetchConversations = async () => {
      try {
        const existingConversationsQuery = query(
          collection(firestore, "conversations"),
          where("participants", "array-contains", currentUser.uid)
        );

        const existingConversationsSnapshot = await getDocs(
          existingConversationsQuery
        );

        const conversations = existingConversationsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Conversation)
        );

        const unsubscribe = onSnapshot(
          existingConversationsQuery,
          (snapshot) => {
            const updatedConversations: Conversation[] = [];
            snapshot.forEach((doc) => {
              const conversationData = doc.data();
              const conversation: any = {
                id: doc.id,
                ...conversationData,
                messages: [],
              };
              updatedConversations.push(conversation);
            });
            setConversations(updatedConversations);
          }
        );

        for (const conversation of conversations) {
          const uid = conversation.participants.find(
            (participantId) => participantId !== currentUser.uid
          );
          if (uid) {
            const response = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/user/${uid}`,
              currentUser.config
            );
            const userInfo = response.data;
            const storage = getStorage();
            const storageRef = ref(storage, userInfo.avatar as any);
            const url = await getDownloadURL(storageRef);
            userInfo.avatar = { url, path: storageRef.fullPath };
            conversation.participants = [userInfo, currentUser];

            const messagesQuery = query(
              collection(
                firestore,
                "conversations",
                conversation.id,
                "messages"
              )
            );

            const unsubscribeMessages = onSnapshot(
              messagesQuery,
              (snapshot) => {
                const updatedMessages = snapshot.docs.map((doc) => doc.data());
                conversation.messages = updatedMessages;
                setConversations((prevConversations) => {
                  const updatedConversations = prevConversations.map(
                    (prevConversation) =>
                      prevConversation.id === conversation.id
                        ? conversation
                        : prevConversation
                  );
                  return updatedConversations;
                });
              }
            );
          }
        }
        setLoading(false);

        return () => {
          unsubscribe();
        };
      } catch (error) {
        setLoading(false);
        console.error("Error fetching conversations: ", error);
        toast.error("Failed to fetch conversations.");
      }
    };

    fetchConversations();
  }, [currentUser]);

  const sendMessage = async (message: string, recipientId: string) => {
    try {
      if (!currentUser) return;
      const existingConversation = conversations.find((conversation) => {
        const participants = conversation.participants.map(
          (participant) => participant.uid
        );
        return participants.includes(recipientId);
      });
      if (existingConversation) {
        const conversationId = existingConversation.id;
        const conversationRef = collection(
          firestore,
          "conversations",
          conversationId,
          "messages"
        );
        await addDoc(conversationRef, {
          senderId: currentUser.uid,
          text: message,
          timestamp: serverTimestamp(),
        });
      } else {
        // No existing conversation, create a new one
        const newConversationRef = await addDoc(
          collection(firestore, "conversations"),
          {
            participants: [currentUser.uid, recipientId],
          }
        );

        const conversationId = newConversationRef.id;
        const conversationRef = collection(
          firestore,
          "conversations",
          conversationId,
          "messages"
        );
        await addDoc(conversationRef, {
          senderId: currentUser.uid,
          text: message,
          timestamp: serverTimestamp(),
        });
      }

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send the message.");
    }
  };

  return (
    <ConversationsContext.Provider value={{ conversations, sendMessage }}>
      {!loading && children}
    </ConversationsContext.Provider>
  );
};
