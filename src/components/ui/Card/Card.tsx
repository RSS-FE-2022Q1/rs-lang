import React from 'react';

import './Card.pcss';

const Card = (props: React.PropsWithChildren): JSX.Element => {
  const { children } = props;
  return <div className="card">{children}</div>;
};
export default Card;
