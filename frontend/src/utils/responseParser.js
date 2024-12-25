export const parseOpenAIResponse = (response) => {
  try {
    const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
    
    return {
      summary: parsedResponse.Summary?.[0] || 'No summary available',
      hotels: parsedResponse.Hotels?.map(hotel => ({
        name: hotel.name,
        features: hotel.features,
        link: hotel.link
      })) || [],
      attractions: parsedResponse.Attractions?.map(attr => ({
        name: attr.name,
        description: attr.description,
        link: attr.link
      })) || [],
      restaurants: parsedResponse.Restaurants?.map(rest => ({
        name: rest.name,
        type: rest.type,
        price_range: rest.price_range
      })) || [],
      costs: parsedResponse.Costs?.[0] || {}
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return null;
  }
};
