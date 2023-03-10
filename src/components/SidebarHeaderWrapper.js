import React, { useState } from 'react';
import {Box, useMediaQuery} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HeaderView } from './Header/header.view';
import { SidebarView } from './Sidebar/sidebar.view';
import {FooterView} from "./Footer/footer.view";

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 44,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const Layout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  return (
    <>
      <LayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            height: smDown ? '' : '90%',
            minHeight: smDown ? '78vh' : '78vh',
            backgroundColor: '#fff',
            overflow: 'auto',
            paddingTop: 3,
          }}
        >
          {children}
        </Box>
      </LayoutRoot>
      <HeaderView onSidebarOpen={() => setSidebarOpen(true)} />
      <SidebarView
        org={props.org}
        literals = {props.literals}
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <Box component="footer" sx={{ p: 2, paddingLeft: smDown ? '0' : '20%', bgcolor: '#fff', display: "flex", flexDirection: 'row', justifyContent: "center"}}>
        <FooterView />
      </Box>
    </>
  );
};
