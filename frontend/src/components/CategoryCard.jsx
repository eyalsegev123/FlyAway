import React from 'react';
import { Typography, Card, CardContent, Link, List, ListItem, ListItemText, Divider } from '@mui/material';

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
                      <Link href={hotel.link} target="_blank" rel="noopener noreferrer">
                        {hotel.name}
                      </Link>
                    }
                    secondary={hotel.features}
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
                <Typography variant="h6" gutterBottom>
                  {category.category.replace(/_/g, ' ')}
                </Typography>
                <List>
                  {category.recommended_attractions.map((attraction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={attraction.name}
                          secondary={attraction.description || "Description unavailable"}
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
                <Typography variant="h6" gutterBottom>
                  {category.category.replace(/_/g, ' ')}
                </Typography>
                <List>
                  {category.recommended_restaurants.map((restaurant, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={restaurant.name}
                          secondary={
                            <>
                              <Typography component="span" display="block">
                                {restaurant.cuisine}
                              </Typography>
                              {restaurant.additionalInfo && (
                                <Typography component="span" display="block">
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

        case 'costs':
          return (
            <div>
              {Object.entries(content).map(([category, values], categoryIndex) => (
                <React.Fragment key={category}>
                  <Typography
                    variant="h6" // Adjusted the title size to be larger
                    gutterBottom
                    style={{ fontWeight: 'bold' }} // Make it bold if needed
                  >
                    {category.replace(/_/g, ' ')}
                  </Typography>
                  <List>
                    {Object.entries(values).map(([key, value], index) => (
                      <ListItem key={key} dense>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              style={{
                                fontWeight: 'bold', // Title slightly larger
                                color: 'black', // Title color
                              }}
                            >
                              {key.replace(/_/g, ' ')}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              style={{
                                color: 'black', // Content color
                              }}
                            >
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
        return (
          <Typography variant="body1" paragraph>
            {content}
          </Typography>
        );

      case 'dates':
        return (
          <Typography variant="body1" paragraph>
            {content}
          </Typography>
        );

      default:
        return (
          <Typography variant="body1" paragraph>
            {content}
          </Typography>
        );
    }
  };

  return (
    <Card className="content-card">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;