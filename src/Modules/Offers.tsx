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
  const yourOffers = transactions.filter(
    (transaction) => transaction?.createdBy?._id === currentUser?._id
  );
  const incomingOffers = transactions.filter(
    (transaction) => transaction?.targetUser?._id === currentUser?._id
  );
  const acceptedOffers = transactions.filter(
    (transaction) => transaction?.status === "accepted"
  );
  return (
    <Card elevation={0} sx={{ background: "transparent" }}>
      <CardContent>
        {acceptedOffers.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography>Accepted Offers</Typography>
                <Badge
                  badgeContent={acceptedOffers.length}
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
              <TransactionList transactions={acceptedOffers} />
            </AccordionDetails>
          </Accordion>
        )}
        {yourOffers.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography>Pending Offers</Typography>
                <Badge
                  badgeContent={yourOffers.length}
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
              <TransactionList transactions={yourOffers} />
            </AccordionDetails>
          </Accordion>
        )}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography>Incoming Offers</Typography>
              <Badge
                badgeContent={incomingOffers.length}
                color="error"
                sx={{ marginLeft: "10px" }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TransactionList transactions={incomingOffers} />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Offers;
