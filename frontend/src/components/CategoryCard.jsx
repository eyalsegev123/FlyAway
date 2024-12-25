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
          <List>
            {content.map((attr, index) => (
              <React.Fragment key={attr.name}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Link href={attr.link} target="_blank" rel="noopener noreferrer">
                        {attr.name}
                      </Link>
                    }
                    secondary={attr.description}
                  />
                </ListItem>
                {index < content.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        );

      case 'restaurants':
        return (
          <List>
            {content.map((rest, index) => (
              <React.Fragment key={rest.name}>
                <ListItem>
                  <ListItemText
                    primary={rest.name}
                    secondary={`${rest.type} • ${rest.price_range}`}
                  />
                </ListItem>
                {index < content.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        );

      case 'costs':
        return (
          <List>
            {Object.entries(content).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key.replace(/_/g, ' ')}
                  secondary={value}
                />
              </ListItem>
            ))}
          </List>
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
