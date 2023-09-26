import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Box, Tab, Tabs, Button } from '@mui/material';
import { Comment } from './Comment';
import { SingleActivity } from './SingleActivity';
import { SortOutlined } from '@mui/icons-material';

const StyledTabs = styled((props) => <Tabs {...props} />)({
  color: 'black',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'black',
  padding: '5px',
  minHeight: 'auto',
  minWidth: 'auto',
  background: 'rgb(244,245,247)',
  '&.Mui-selected': {
    background: 'rgb(80,95,121)',
    color: 'white',
  },
  ':hover:not(.Mui-selected)': {
    background: 'rgb(80,95,121)',
    color: 'white',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

const tabViews = {
  All: <MockedActivityComponent />,
  Comments: <Comment />,
  History: <MockedActivityComponent />,
};

export function ActivityView() {
  const [selectedTab, setSelectedTab] = React.useState(1);
  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const getCurrentTabView = (tab) => tabViews[Object.keys(tabViews)[tab - 1]];

  return (
    <Box sx={{ width: '100%' }} p={1}>
      <Typography fontWeight="bold" variant="p">
        Activity
      </Typography>
      <Box mt={1}>
        <Stack direction="row" justifyContent="space-between">
          <StyledTabs value={selectedTab} onChange={handleTabChange}>
            <Typography mr={1} variant="p">
              Show:
            </Typography>
            {Object.keys(tabViews).map((title) => (
              <StyledTab label={title} key={title} />
            ))}
          </StyledTabs>
          <Button
            endIcon={<SortOutlined />}
            size="small"
            style={{
              padding: '5px',
              height: '30px',
            }}
            sx={{
              textTransform: 'none',
              background: 'rgb(244,245,247)',
              color: 'black',
              ':hover': {
                background: 'lightgray',
              },
            }}
          >
            Newest first
          </Button>
        </Stack>
        <Box sx={{ p: 1 }}>{getCurrentTabView(selectedTab)}</Box>
      </Box>
    </Box>
  );
}

function MockedActivityComponent() {
  return (
    <Stack spacing={2}>
      {Array(3)
        .fill()
        .map((_, i) => {
          return <SingleActivity key={i} />;
        })}
    </Stack>
  );
}
