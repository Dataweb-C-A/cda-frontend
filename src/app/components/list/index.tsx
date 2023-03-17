import React from 'react';

interface ListItemProps {
  text: string;
}

const ListItem: React.FC<ListItemProps> = ({ text }) => (
  <li>{text}</li>
);

interface ListProps {
  items: string[];
}

const List: React.FC<ListProps> = ({ items }) => (
  <ul>
    {items.map((item, index) => (
      <ListItem key={index} text={item} />
    ))}
  </ul>
);

export default List;
