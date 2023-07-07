import React, { useContext, useEffect } from "react";
import { ConversationsContext } from "../Utils/ConversationProvider";
import { UserContext } from "../Utils/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Route, Routes } from "react-router-dom";
import ConversationDetail from "../Components/ConversationDetail";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";

const MessageList: React.FC = () => {
  const { conversations } = useContext(ConversationsContext);
  const { currentUser } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setBreadcrumbs([
      { path: "/", breadcrumbName: "Home" },
      { path: "/messages", breadcrumbName: "Messages" },
    ]);
  }, []);
  const handleClickConversation = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  const activeConversationId = location.pathname.split("/").pop();

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            flex: "0 0 30%",
            height: "100%",
            overflowY: "scroll",
            backgroundColor: "#f0f0f0",
          }}
        >
          <List sx={{ padding: 0 }}>
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (participant) => participant.uid !== currentUser?.uid
              );
              return (
                <Card
                  key={conversation.id}
                  sx={{
                    marginBottom: "1rem",
                    backgroundColor:
                      activeConversationId === conversation.id
                        ? "#e0e0f0"
                        : "inherit",
                    borderRadius: "0px",
                  }}
                >
                  <ListItemButton
                    onClick={() => handleClickConversation(conversation.id)}
                    selected={activeConversationId === conversation.id}
                  >
                    <CardHeader
                      avatar={
                        <ListItemAvatar>
                          <Avatar src={otherParticipant?.avatar?.url} />
                        </ListItemAvatar>
                      }
                      title={otherParticipant.username}
                    />
                  </ListItemButton>
                </Card>
              );
            })}
          </List>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ flex: "1 1 70%", overflowY: "scroll", height: "100%" }}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">
                      Select a conversation from the list
                    </Typography>
                  </CardContent>
                </Card>
              }
            />
            <Route path=":conversationId" element={<ConversationDetail />} />
          </Routes>
        </Box>
      </Box>
    </Layout>
  );
};

export default MessageList;
