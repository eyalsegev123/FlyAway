import React from "react";
import Slider from "react-slick";
import HomeTripCard from "../components/HomeTripCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/pages/Home.css";
import parisImage from '../assets/paris.jpeg';
import tokyoImage from '../assets/tokyo.jpg';
import newyorkImage from '../assets/newyork.webp';

const HomePage = () => {
  const trips = [
    {
      id: 1,
      destination: "Paris",
      description: "City of Light and Romance",
      image: parisImage
    },
    {
      id: 2,
      destination: "Tokyo",
      description: "Modern Meets Traditional",
      image: tokyoImage
    },
    {
      id: 3,
      destination: "New York",
      description: "The City That Never Sleeps",
      image: newyorkImage
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
    <div className="homepage-container">
      <div className="homepage-main">
        <div className="homepage-title">
          <h1>Welcome to FlyAway!</h1>
          <p>Discover your next adventure</p>
        </div>
        <div className="carousel-container">
          <Slider {...settings}>
            {trips.map((trip) => (
              <HomeTripCard key={trip.id} trip={trip} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
   
  );
};

export default HomePage;
