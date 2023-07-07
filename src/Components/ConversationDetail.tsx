import React, { useContext, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { ConversationsContext } from "../Utils/ConversationProvider";
import { UserContext } from "../Utils/UserProvider";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { format } from "date-fns";

const ConversationDetail: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { conversations, sendMessage } = useContext(ConversationsContext);
  const [messageInput, setMessageInput] = useState("");
  const lastMessageRef = useRef<HTMLLIElement>(null);

  const conversation = conversations.find(
    (conversation) => conversation.id === conversationId
  );

  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const handleMessageSend = () => {
    if (messageInput.trim() !== "") {
      sendMessage(messageInput, conversation?.participants[0].uid);
      setMessageInput("");
    }
  };

  if (!conversation) {
    return (
      <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
        <Typography variant="h4">Conversation not found</Typography>
      </Container>
    );
  }
  const sortedMessages = conversation.messages.sort(
    (a, b) => a.timestamp - b.timestamp
  );
  return (
    <Container
      maxWidth="md"
      sx={{
        margin: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "1rem",
          display: "flex",
          height: "95%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            maxHeight: "85%",
            overflowY: "scroll",
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            component="div"
          >
            {sortedMessages.map((message, idx) => {
              const sender = conversation?.participants.find(
                (user) => user.uid === message.senderId
              );
              return (
                <ListItem
                  key={message.timestamp}
                  alignItems="flex-start"
                  sx={{ marginBottom: "1rem" }}
                  ref={
                    idx === sortedMessages.length - 1 ? lastMessageRef : null
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={sender?.avatar?.url} />
                  </ListItemAvatar>
                  <ListItemText
                    secondary={message.text}
                    primary={
                      <>
                        <Typography
                          sx={{ display: "inline", fontWeight: "bold" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {sender?.username}
                        </Typography>
                        <Typography
                          sx={{ display: "inline", marginLeft: "0.5rem" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {message.timestamp
                            ? format(
                                message.timestamp.toDate(),
                                "dd MMM yyyy HH:mm"
                              )
                            : ""}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ padding: "1rem" }}>
          <TextField
            label="Message"
            variant="outlined"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            onClick={handleMessageSend}
            disabled={!messageInput.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConversationDetail;
