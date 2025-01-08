import React from 'react';
import styled from 'styled-components';

const AboutUsCard = ({ title, description }) => {
  return (
    <StyledWrapper>
      <div className="notification">
        <div className="notiglow" />
        <div className="notiborderglow" />
        <div className="notititle">{title}</div>
        <div className="notibody">{description}</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .notification {
    display: flex;
    flex-direction: column;
    isolation: isolate;
    position: relative;
    width: 18rem;
    height: 8rem;
    background: #29292c;
    border-radius: 1rem;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 16px;
    --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
    --color: #32a6ff;
  }

  .notification:before {
    position: absolute;
    content: "";
    inset: 0.0625rem;
    border-radius: 0.9375rem;
    background: #18181b;
    z-index: 2;
  }

  .notification:after {
    position: absolute;
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    border-radius: 0.125rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }

  .notification:hover:after,
  .notification:hover .notititle,
  .notification:hover .notibody {
    transform: translateX(0.25rem);
  }

  .notititle, .notibody {
    padding: 0.65rem 0.25rem 0.4rem 1.25rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notititle {
    color: var(--color);
    font-weight: 500;
    font-size: 1.1rem;
  }

  .notibody {
    color: #99999d;
    font-size: 1em;
  }

  .notiglow,
  .notiborderglow {
    position: absolute;
    width: 20rem;
    height: 20rem;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side at center, white, transparent);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .notification:hover .notiglow,
  .notification:hover .notiborderglow {
    opacity: 0.1;
  }
`;

export default AboutUsCard;
