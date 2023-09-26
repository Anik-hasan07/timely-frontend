import React from 'react';

const BlockList = ({ items, renderItem }) => {
  return (
    <>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </>
  );
};

export default BlockList;
