// Interview locations data
// To add new locations, simply add a new object to this array

const locations = [
    {
        name: "East Rutherford, NJ",
        coords: [40.7622, -73.9497],
        type: "home",
        description: "Home",
        short_description: "Home" // Short description for distance list
    }
    {
        name: "Rutherford, NJ",
        coords: [40.8265, -74.1068],
        type: "interview",
        description: "MetLife",
        short_description: "MetLife" // Short description for distance list
    }
];

/* USAGE INSTRUCTIONS:
-------------------
Finding Coordinates:

Google: "[city name] coordinates"
Or use: https://www.latlong.net/

Adding New Locations:
1. To add a new interview location, copy the format below:
   {
       name: "City Name, STATE",
       coords: [latitude, longitude],
       type: "interview",
       description: "Final Round Interview", // Detailed description for marker popup header
       short_description: "FR - Corp Name" // Short description for distance list
   }

2. To find coordinates for a city, search "[city name] coordinates" on Google

3. You can customize the description field:
   - "Final Round Interview"
   - "Final Round - Company Name"
   - "Phone Screen"
   - "On-site Interview"
   etc.

4. Type options:
   - "home" = green home icon (only one should be set as 'home')
   - "interview" = blue briefcase icon

EXAMPLE - Adding San Francisco:
{
    name: "San Francisco, CA",
    coords: [37.7749, -122.4194],
    type: "interview",
    description: "Final Round - Tech Corp",
    short_description: "FR - Tech Corp"
}
*/