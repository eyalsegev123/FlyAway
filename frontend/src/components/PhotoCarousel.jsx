import React, { useState, useCallback } from 'react';
import { IconButton, Box, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const PhotoCarousel = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, photos.length - 1));
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 200px)' }}>
      <Box sx={{
        flex: 1,
        height: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={photos[currentIndex]}
          alt={`Trip moment ${currentIndex + 1}`}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      <MobileStepper
        steps={photos.length}
        position="static"
        activeStep={currentIndex}
        sx={{ bgcolor: 'transparent' }}
        nextButton={
          <IconButton onClick={handleNext} disabled={currentIndex === photos.length - 1} sx={{ color: '#00bfff' }}>
            <KeyboardArrowRight />
          </IconButton>
        }
        backButton={
          <IconButton onClick={handlePrev} disabled={currentIndex === 0} sx={{ color: '#00bfff' }}>
            <KeyboardArrowLeft />
          </IconButton>
        }
      />
    </Box>
  );
};

export default PhotoCarousel;