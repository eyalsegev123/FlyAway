import React from "react";
import Slider from "react-slick";
import HomeTripCard from "../components/HomeTripCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/pages/Home.css";
import parisImage from '../assets/paris.jpeg';
import tokyoImage from '../assets/tokyo.jpg';
import newyorkImage from '../assets/newyork.webp';
import telavivImage from '../assets/Tel-Aviv-beach.jpg';
import premierLeagueImage from  '../assets/lion.jpg'
import thailandImage from '../assets/thailand.jpg'
import styled from 'styled-components';


const HomePage = () => {
  const trips = [
    {
      id: 1,
      destination: "Paris",
      description: "Romantic vacation in the city of lights",
      image: parisImage,
      tripGenres: ["Romantic", "Restaurants", "Culture"],
      travelers: "Couple"
    },
    {
      id: 2,
      destination: "Tokyo",
      description: "Families culinary trip",
      image: tokyoImage,
      tripGenres: ["Culinary", "Restaurants", "Food markets"],
      travelers: "Families"
    },
    {
      id: 3,
      destination: "Tel Aviv",
      description: "Nightlife in the City That Never Sleeps",
      image: telavivImage,
      tripGenres: ["Nightlife", "Parties", "Clubs", "Festivals", "Trance festivals", "Electric festivals", "Shows"],
      travelers: "Friends"
    },
    {
      id: 4,
      destination: "New York",
      description: "Shopping with friends in the Big-City life",
      image: newyorkImage,
      tripGenres: ["Shopping", "Culture"],
      travelers: "Friends"
    },
    {
      id: 5,
      destination: "Thailand",
      description: "Beaches honeymoon in the islands",
      image: thailandImage,
      tripGenres: ["Honeymoon", "Restaurants", "Beaches", "Parties", "Festivals", "Culture"],
      travelers: "Couple"
    },
    {
      id: 6,
      destination: "England",
      description: "Football trip with your friends",
      image: premierLeagueImage,
      tripGenres: ["Football matches", "Sport events", "Sport activity", "Premier League"],
      travelers: "Friends"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <StyledModal>
      <div className="homepage-container">
        <div className="homepage-main">
          <h1 className="carousel-title">Quick AI Recommendations</h1>
          <div className="carousel-container">
            <Slider {...settings}>
              {trips.map((trip) => (
                <HomeTripCard key={trip.id} trip={trip} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </StyledModal>
   
  );
};

const StyledModal = styled.div`
  .carousel-title {
    color: white; /* Set the text color to white */
  }
`;


export default HomePage;
