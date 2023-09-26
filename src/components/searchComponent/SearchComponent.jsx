import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import React from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: '1px solid lightgrey',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(2),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.between('xs', 'md')]: {
    marginBottom: theme.spacing(1),
    width: '90%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: 100,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchComponent = ({ iconPosition, onChange, placeHolder = 'Search...' }) => {
  return (
    <Search>
      {iconPosition === 'right' ? (
        <>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          <SearchIcon />
        </>
      ) : (
        <>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            sx={{ width: '100%' }}
            onChange={onChange}
            placeholder={placeHolder}
            inputProps={{ 'aria-label': 'search' }}
          />
        </>
      )}
    </Search>
  );
};

export default SearchComponent;
