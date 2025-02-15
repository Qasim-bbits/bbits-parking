import { Typography } from '@mui/material';
import { config } from '../../Constants';

export const FooterView = () => {

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        © {(new Date()).getFullYear()} {config.url.COMPANY_NAME}
      </Typography>
    );
};
