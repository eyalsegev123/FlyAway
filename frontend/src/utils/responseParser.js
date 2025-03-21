export const parseOpenAIResponse = (response) => {
  try {
    const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
    
    return {
      summary: parsedResponse.Summary,
      
      hotels: parsedResponse.Hotels?.map(hotel => ({
        name: hotel.name,
        features: hotel.features,
        link: hotel.link
      })) || [],

      attractions: Object.keys(parsedResponse.Attractions || {}).map(genre_category => ({
        category: genre_category,
        recommended_attractions: (parsedResponse.Attractions[genre_category] || []).map(attr => ({
          name: attr.name,
          description: attr.description
        }))
      })),
      
      restaurants: Object.keys(parsedResponse.Restaurants || {}).map(restaurant_category => ({
        category: restaurant_category,
        recommended_restaurants: (parsedResponse.Restaurants[restaurant_category] || []).map(rest => ({
          name: rest.name,
          cuisine: rest.cuisine,
          additionalInfo: rest.additional_info
        }))
      })),

      costs: parsedResponse.Costs,

      dates: parsedResponse.Dates,

      schedule: Array.isArray(parsedResponse.Schedule)
        ? parsedResponse.Schedule.map((dayObj, index) => {
            const [dayKey, schedule] = Object.entries(dayObj)[0];
            return {
              day: dayKey,
              morning: schedule.morning,
              noon: schedule.noon,
              evening: schedule.evening
            };
          })
        : [] ,
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return null;
  }
};
