# 🗺️ Data Scientist Interview Journey Map

This project provides a simple, interactive map visualization of interview locations relative to a designated Home Base and other important personal locations. It's a tool to help visualize travel logistics and distances for a job search across the United States.

***

## ✨ Features

* **Interactive Map:** Built using **Leaflet.js** and **OpenStreetMap**.
* **Home Base Tracking:** Shows your current location (New York City, NY) marked with a green 🏠 icon.
* **Distance Calculation:** Lines connect the Home Base to all Interview Locations, displaying the distance in miles.
* **Comprehensive Popups:** Clicking any marker shows the detailed location description and a concise list of distances to all other key locations in the project.
* **Easy Customization:** All location data is stored in simple, editable JavaScript files (`cities.js` and `important_cities.js`).

***

## 🚀 Setup and Usage

### 1. File Structure

Ensure your repository has the following file structure:

```

interview-map/
├── index.html          \# The main map and script logic
├── cities.js           \# Data file for Home Base and Interview Locations
├── important\_cities.js \# Data file for Fixed Reference Locations (e.g., family homes, old cities)
├── README.md           \# This file

````

### 2. Running Locally

You can run this project directly in your browser:

1.  Clone this repository to your local machine.
2.  Open the `index.html` file with your web browser (e.g., drag and drop it into Chrome or Firefox).

### 3. Deploying to GitHub Pages

To make your map publicly accessible:

1.  Push your code to your GitHub repository.
2.  Go to your repository **Settings** > **Pages**.
3.  Under **Source**, select the **main** branch and the root (`/`) folder.
4.  Save the changes. Your map will be live at `https://[YourUsername].github.io/[YourRepoName]`.

***

## ⚙️ Customizing Your Data

All locations are defined in the external JavaScript files. You only need to edit these files to update the map.

### 1. `cities.js` (Home and Interview Locations)

This file holds dynamic locations like your current residence and potential job sites.

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `name` | Full city and state name. | `"Houston, TX"` |
| `coords` | Latitude and longitude `[lat, lon]`. | `[29.7604, -95.3698]` |
| `type` | Determines the map marker style. **Must be** `"home"` or `"interview"`. | `"interview"` |
| `description` | Detailed text for the popup header. | `"Final Round Interview - TGS"` |
| `short_description` | **Concise label** used in the distance list to keep it brief. | `"TGS Interview"` |

**To add a new interview location:**

```javascript
{
    name: "San Francisco, CA",
    coords: [37.7749, -122.4194],
    type: "interview",
    description: "Final Round - Tech Corp",
    short_description: "FR - Tech Corp"
}
````

### 2\. `important_cities.js` (Fixed Reference Locations)

This file holds static, non-interview locations (e.g., family homes, previous cities). All cities on the map show distances to these locations.

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `name` | Full city and state name. | `"Boulder, CO"` |
| `coords` | Latitude and longitude `[lat, lon]`. | `[40.0150, -105.2705]` |
| `description` | Detailed text for the popup header. | `"Important place - Sanima House"` |
| `short_description` | **Concise label** used in the distance list. | `"Sanima House"` |

**Note on Distances:**
All distance popups are formatted as **City Name (Short Description)**, providing context without the full description length.

-----

## 🛠️ Technology Stack

  * **HTML/CSS:** Structure and basic styling.
  * **JavaScript:** Core logic for data handling and calculations.
  * **Leaflet.js:** Open-source JavaScript library for interactive maps.
  * **OpenStreetMap:** Used as the map tile layer.
  * **Haversine Formula:** Used for accurate great-circle distance calculation (miles).

-----

## 📄 License

This project is open-source and available under the MIT License.
