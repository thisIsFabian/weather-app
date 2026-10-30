import { initTiles } from "./tiles.js";
import { setLocation } from "./main.js";

const input = document.getElementById("searchbar");
const suggestions = document.getElementById("search_suggestions");
const suggestions_content = document.getElementById("search_suggestions_content");

const api_endpoint1 = "https://geocoding-api.open-meteo.com/v1/search";
//const api_endpoint2 = "https://nominatim.openstreetmap.org/search";


const debounceTimerLength = 650;
let debounceTimer;


let results = null;


/**
 * Returns closest matches for a given place name/prefix.
 */
async function searchPlace(name) {
    if (!name || name.trim().length <= 1) return [];

    const url = new URL(api_endpoint1);
    url.searchParams.set('name', name);
    url.searchParams.set('count', '5');
    url.searchParams.set('language', navigator.language.split("-")[0].toLowerCase());
    url.searchParams.set('format', 'json');

    /*const url = new URL(api_endpoint2);
    url.searchParams.set('q', name);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set('limit', "5");*/

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);

    const data = await res.json();
    const results = data.results || [];

    return results;
}


function toggleSuggestions(closeSuggestions) {

    if(closeSuggestions) {
        suggestions.style.display = "none";
        input.style.borderBottomLeftRadius = "25px";
        input.style.borderBottomRightRadius = "25px";
    } else {
        suggestions.style.display = "block";
        input.style.borderBottomLeftRadius = "0";
        input.style.borderBottomRightRadius = "0";
    }

}


input.addEventListener("input", () => {
    results = null;
    clearTimeout(debounceTimer);

    const query = input.value.trim();

    if(!query || query.length <= 1) {
        toggleSuggestions(true);
        return;
    }

    debounceTimer = setTimeout(async () => {
      
        results = await searchPlace(query);

        suggestions_content.innerHTML = "";

        results.forEach((place, i) => {
            const suggestion_elem = document.createElement("div");
            
            let suggestionText = "";
            
            // check if the place has a country and is not an independent country ("PCLI") itself
            if(place.country && place.feature_code !== "PCLI") {
                suggestionText = place.name + ", " + place.country;
            } else {
                suggestionText = place.name;
            }

            // try to give more information if places have the same name:
            if(((i < (results.length - 1)) && results[i+1].name === place.name) || ((i > 0) && results[i-1].name === place.name)) {
                let appendix = place.admin1 || place.admin2 || null;
                if(appendix) {
                    suggestionText = suggestionText + ", " + appendix;
                }
            }

            suggestion_elem.textContent = suggestionText;

            suggestion_elem.addEventListener("click", () => {
                input.value = place.name;
                toggleSuggestions(true);
                saveLocation(i);
                results = null;
            });

            suggestions_content.appendChild(suggestion_elem);
        });

        toggleSuggestions(results.length === 0);

    }, debounceTimerLength);

});

document.getElementById("searchbar_form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    toggleSuggestions(true);

    // save first search result:
    if(results && results.length > 0) {
        input.value = results[0].name;
        saveLocation(0);
        input.blur(); 
    }

    results = null;

});

function saveLocation(result_index) {

    const result = results[result_index];

    if(result) {
        let location = {
            name: result.name,
            lat: result.latitude,
            lon: result.longitude,
            country: result.country || result.country_code || ""
        };
        
        localStorage.setItem("location", JSON.stringify(location));

        setLocation(location);
        initTiles();
    }

}