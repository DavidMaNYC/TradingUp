import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
interface IListingCardProps {
  id?: string;
  title: string;
  description: string;
  location: string;
  images: any[];
  onClick: () => void;
  selected?: boolean;
  selectable?: boolean;
}

const ListingCard = ({
  id,
  title,
  description,
  location,
  images,
  onClick,
  selected = false,
  selectable = false,
}: IListingCardProps) => {
  const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: "56.25%", // 16:9
    "@media (max-width:600px)": {
      paddingTop: "75%", // 4:3
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Stop event bubbling
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    window.open(`/listing/${id}`, "_blank");
    handleMenuClose();
  };

  return (
    <Box position="relative">
      {selectable && (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => {
              handleMenuClick(event);
              event.stopPropagation();
            }}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 100,
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleNavigate}>Go to listing</MenuItem>
          </Menu>
        </>
      )}
      <Card onClick={onClick}>
        <CardActionArea>
          {selectable && (
            <>
              <Checkbox
                checked={selected}
                onChange={onClick}
                inputProps={{ "aria-label": `select ${title}` }}
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "18px",
                  height: "18px",
                  backgroundColor: "white",
                  "& .MuiSvgIcon-root": {
                    borderRadius: "50%",
                  },
                }}
              />
            </>
          )}
          <StyledCardMedia image={images[0]?.url} title={title} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Location: {location}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default ListingCard;
