import { List, ListItem, Avatar, Typography, Box } from "@mui/material";

interface ITransactionList {
  transactions: any[];
}

const MAX_LISTINGS_PER_TRANSACTION = 3; // Maximum number of listings to show per transaction

const TransactionList = ({ transactions }: ITransactionList) => {
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
              <Typography variant="h6">Offers</Typography>
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
                    +{transaction.offers.length - MAX_LISTINGS_PER_TRANSACTION}
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                margin: "10px 0",
              }}
            >
              <Typography variant="h6">Requests</Typography>
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
                {transaction.demands.length > MAX_LISTINGS_PER_TRANSACTION && (
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
                    +{transaction.demands.length - MAX_LISTINGS_PER_TRANSACTION}
                  </Box>
                )}
              </Box>
            </Box>
          </ListItem>
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
