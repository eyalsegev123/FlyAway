import React, { useState } from 'react';
import styled from 'styled-components';

const WishlistButton = ({ onAddToWishlist }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (!isAdded) {
      onAddToWishlist();
      setIsAdded(true);
    }
  };

  return (
    <StyledWrapper>
      <ul>
        <li 
          onClick={handleClick}
          style={{'--i': '#FF9966', '--j': '#FF5E62'}}
          className={isAdded ? 'added' : ''}
        >
          <span className="icon">{isAdded ? '✔' : '❤️'}</span>
          <span className="title">{isAdded ? 'Added' : 'Add to Wishlist'}</span>
        </li>
      </ul>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ul {
    position: relative;
    display: flex;
    gap: 25px;
  }

  ul li {
    position: relative;
    list-style: none;
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transition: 0.5s;
  }

  ul li:hover, ul li.added {
    width: 180px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0);
  }

  ul li::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 60px;
    background: linear-gradient(45deg, var(--i), var(--j));
    opacity: 0;
    transition: 0.5s;
  }

  ul li:hover::before, ul li.added::before {
    opacity: 1;
  }

  ul li::after {
    content: "";
    position: absolute;
    top: 10px;
    width: 100%;
    height: 100%;
    border-radius: 60px;
    background: linear-gradient(45deg, var(--i), var(--j));
    transition: 0.5s;
    filter: blur(15px);
    z-index: -1;
    opacity: 0;
  }

  ul li:hover::after, ul li.added::after {
    opacity: 0.5;
  }

  ul li .icon {
    color: #777;
    font-size: 1.75em;
    transition: 0.5s;
    transition-delay: 0.25s;
  }

  ul li:hover .icon, ul li.added .icon {
    transform: scale(0);
    color: #fff;
    transition-delay: 0s;
  }

  ul li span {
    position: absolute;
  }

  ul li .title {
    color: #fff;
    font-size: 1.1em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transform: scale(0);
    transition: 0.5s;
    transition-delay: 0s;
  }

  ul li:hover .title, ul li.added .title {
    transform: scale(1);
    transition-delay: 0.25s;
  }
`;

export default WishlistButton;
