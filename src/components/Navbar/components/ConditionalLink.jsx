/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Link } from 'react-router-dom';

const ConditionalLink = ({ condition, linkTo, children }) => {
  return <>{condition ? <Link to={linkTo}>{children}</Link> : children}</>;
};

export default ConditionalLink;
