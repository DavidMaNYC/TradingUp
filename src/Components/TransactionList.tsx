import { List, ListItem, Avatar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Utils/UserProvider";
import { useContext } from "react";
import axios from "axios";

interface ITransactionList {
  transactions: any[];
  isAction?: boolean;
  swap?: boolean;
}

const MAX_LISTINGS_PER_TRANSACTION = 3; // Maximum number of listings to show per transaction

const TransactionList = ({
  transactions,
  isAction,
  swap,
}: ITransactionList) => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();
  const handleViewOffer = (offerId: string) => {
    navigate(`/transaction/${offerId}`);
  };
  const handleDecline = async (offerId: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
        {
          status: "declined",
        },
        currentUser?.config
      );
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
    }
  };
  const handleComplete = async (offerId: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
        {
          status: "completed",
        },
        currentUser?.config
      );
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
    }
  };
  return transactions.length > 0 ? (
    <List>
      {transactions.map((transaction) => (
        <Box
          key={transaction.id}
          sx={{
            borderRadius: "4px",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "10px",
            backgroundColor: "#ffffff",
            padding: "10px",
          }}
        >
          <Typography variant="h5">
            Created Date: {new Date(transaction.createdAt).toLocaleString()}
          </Typography>

          <ListItem
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                margin: "10px 0",
              }}
            >
              <Typography variant="h6">Your Items</Typography>
              {!swap ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {transaction.demands
                    .slice(0, MAX_LISTINGS_PER_TRANSACTION)
                    .map((listing: any, idx: any) => (
                      <Avatar
                        key={`${listing.id}_${idx}`}
                        alt={`Demand Image ${listing.id}_${idx}`}
                        src={listing.images[0].url}
                        sx={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  {transaction.demands.length >
                    MAX_LISTINGS_PER_TRANSACTION && (
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f3f3",
                        color: "#888",
                        borderRadius: "50%",
                      }}
                    >
                      +
                      {transaction.demands.length -
                        MAX_LISTINGS_PER_TRANSACTION}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {transaction.offers
                    .slice(0, MAX_LISTINGS_PER_TRANSACTION)
                    .map((listing: any, idx: any) => (
                      <Avatar
                        key={`${listing.id}_${idx}`}
                        alt={`Offer Image ${listing.id}_${idx}`}
                        src={listing.images[0].url}
                        sx={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  {transaction.offers.length > MAX_LISTINGS_PER_TRANSACTION && (
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f3f3",
                        color: "#888",
                        borderRadius: "50%",
                      }}
                    >
                      +
                      {transaction.offers.length - MAX_LISTINGS_PER_TRANSACTION}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Box
              sx={{
                margin: "10px 0",
              }}
            >
              <Typography variant="h6">Their Items</Typography>
              {swap ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {transaction.demands
                    .slice(0, MAX_LISTINGS_PER_TRANSACTION)
                    .map((listing: any, idx: any) => (
                      <Avatar
                        key={`${listing.id}_${idx}`}
                        alt={`Demand Image ${listing.id}_${idx}`}
                        src={listing.images[0].url}
                        sx={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  {transaction.demands.length >
                    MAX_LISTINGS_PER_TRANSACTION && (
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f3f3",
                        color: "#888",
                        borderRadius: "50%",
                      }}
                    >
                      +
                      {transaction.demands.length -
                        MAX_LISTINGS_PER_TRANSACTION}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {transaction.offers
                    .slice(0, MAX_LISTINGS_PER_TRANSACTION)
                    .map((listing: any, idx: any) => (
                      <Avatar
                        key={`${listing.id}_${idx}`}
                        alt={`Offer Image ${listing.id}_${idx}`}
                        src={listing.images[0].url}
                        sx={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  {transaction.offers.length > MAX_LISTINGS_PER_TRANSACTION && (
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f3f3",
                        color: "#888",
                        borderRadius: "50%",
                      }}
                    >
                      +
                      {transaction.offers.length - MAX_LISTINGS_PER_TRANSACTION}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </ListItem>
          {transaction.status === "accepted" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => handleViewOffer(transaction._id)}
              >
                View Offer
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleDecline(transaction._id)}
              >
                Rescind Offer
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleComplete(transaction._id)}
              >
                Mark as Completed
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const otherUser =
                    transaction.createdBy._id !== currentUser?._id
                      ? transaction.createdBy._id
                      : transaction.targetUser._id;
                  navigate(`/profile/${otherUser}`);
                }}
              >
                Contact Seller
              </Button>
            </Box>
          )}
          {isAction && transaction.status !== "accepted" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => handleViewOffer(transaction._id)}
              >
                View Offer
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </List>
  ) : (
    <Typography variant="body1" color="textSecondary">
      No transactions found.
    </Typography>
  );
};

export default TransactionList;
