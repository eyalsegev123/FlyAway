import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const CategoryCard = ({ title, content, type }) => {
  const renderContent = () => {
    switch (type) {
      case 'hotels':
        return (
          <List>
            {content.map((hotel, index) => (
              <React.Fragment key={hotel.name}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold" color="textPrimary">
                        <Link href={hotel.link} target="_blank" rel="noopener noreferrer" underline="hover">
                          {hotel.name}
                        </Link>
                      </Typography>
                    }
                    secondary={
                      <Typography variant="h6" color="textPrimary">
                        {hotel.features}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < content.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        );

      case 'attractions':
        return (
          <div>
            {content.map((category, categoryIndex) => (
              <React.Fragment key={category.category}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {category.category.replace(/_/g, ' ')}
                </Typography>
                <List>
                  {category.recommended_attractions.map((attraction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="h6" fontWeight="bold" color="textPrimary">
                              {attraction.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="h6" color="textPrimary">
                              {attraction.description || 'Description unavailable'}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < category.recommended_attractions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                {categoryIndex < content.length - 1 && <Divider style={{ margin: '16px 0' }} />}
              </React.Fragment>
            ))}
          </div>
        );

      case 'restaurants':
        return (
          <div>
            {content.map((category, categoryIndex) => (
              <React.Fragment key={category.category}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {category.category.replace(/_/g, ' ')}
                </Typography>
                <List>
                  {category.recommended_restaurants.map((restaurant, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="h6" fontWeight="bold" color="textPrimary">
                              {restaurant.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="h6" display="block" color="textPrimary">
                                {restaurant.cuisine}
                              </Typography>
                              {restaurant.additionalInfo && (
                                <Typography variant="h6" display="block" color="textPrimary">
                                  {restaurant.additionalInfo}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < category.recommended_restaurants.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                {categoryIndex < content.length - 1 && <Divider style={{ margin: '16px 0' }} />}
              </React.Fragment>
            ))}
          </div>
        );
      
      case 'schedule':
        return (
          <List>
            {content.map((daySchedule, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h5" fontWeight="bold" color="textPrimary" gutterBottom>
                        {daySchedule.day.charAt(0).toUpperCase() + daySchedule.day.slice(1)}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="h6" color="textPrimary"><strong>Morning:</strong> {daySchedule.morning}</Typography>
                        <Typography variant="h6" color="textPrimary"><strong>Noon:</strong> {daySchedule.noon}</Typography>
                        <Typography variant="h6" color="textPrimary"><strong>Evening:</strong> {daySchedule.evening}</Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < content.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        );
        

      case 'costs':
        return (
          <div>
            {Object.entries(content).map(([category, values], categoryIndex) => (
              <React.Fragment key={category}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {category.replace(/_/g, ' ')}
                </Typography>
                <List>
                  {Object.entries(values).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" fontWeight="bold" color="textPrimary">
                            {key.replace(/_/g, ' ')}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="h6" color="textPrimary">
                            {value}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {categoryIndex < Object.entries(content).length - 1 && (
                  <Divider style={{ margin: '16px 0' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case 'summary':
      case 'dates':
      default:
        return (
          <Typography variant="h6" color="textPrimary" paragraph>
            {content}
          </Typography>
        );
    }
  };

  return (
    <Card className="content-card">
      <CardContent>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="textPrimary">
          {title}
        </Typography>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
