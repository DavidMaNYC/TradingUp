import {
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TransactionList from "../Components/TransactionList";
import { UserContext } from "../Utils/UserProvider";
import { useContext } from "react";

interface IOffer {
  transactions: any[];
}

const Offers = (props: IOffer) => {
  const { transactions } = props;
  const { currentUser } = useContext(UserContext);
  const pendingItems = transactions.filter(
    (transaction) =>
      transaction?.turn !== currentUser?._id &&
      transaction?.status !== "accepted" &&
      transaction?.status !== "declined"
  );
  const actionItems = transactions.filter(
    (transaction) =>
      transaction?.turn === currentUser?._id &&
      transaction?.status !== "declined"
  );
  const acceptedOffers = transactions.filter(
    (transaction) => transaction?.status === "accepted"
  );
  const declinedOffers = transactions.filter(
    (transaction) => transaction?.status === "declined"
  );
  return (
    <Card elevation={0} sx={{ background: "transparent" }}>
      <CardContent>
        {actionItems.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography>Action Required</Typography>
                <Badge
                  badgeContent={actionItems.length}
                  color="error"
                  sx={{ marginLeft: "10px" }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TransactionList transactions={actionItems} isAction={true} />
            </AccordionDetails>
          </Accordion>
        )}
        {pendingItems.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography>Pending</Typography>
                <Badge
                  badgeContent={pendingItems.length}
                  color="primary"
                  sx={{
                    ".MuiBadge-badge": {
                      backgroundColor: "#808080",
                      color: "#fff",
                    },
                    marginLeft: "10px",
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TransactionList transactions={pendingItems} swap={true} />
            </AccordionDetails>
          </Accordion>
        )}
        {declinedOffers.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography>Declined Offers</Typography>
                <Badge
                  badgeContent={declinedOffers.length}
                  color="primary"
                  sx={{
                    ".MuiBadge-badge": {
                      backgroundColor: "#808080",
                      color: "#fff",
                    },
                    marginLeft: "10px",
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TransactionList transactions={declinedOffers} />
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default Offers;
