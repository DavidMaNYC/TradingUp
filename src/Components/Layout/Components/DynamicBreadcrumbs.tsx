import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import { useContext } from "react";
import { BreadcrumbContext } from "../../../Utils/BreadcrumbProvider";

const DynamicBreadcrumbs = () => {
  const { breadcrumbs } = useContext(BreadcrumbContext);
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography color="textPrimary" key={breadcrumb.path}>
            {breadcrumb.breadcrumbName}
          </Typography>
        ) : (
          <Link
            color="inherit"
            to={breadcrumb.path}
            component={RouterLink}
            key={breadcrumb.path}
          >
            {breadcrumb.breadcrumbName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
