
/**
 * @returns A dictionary with latitude and longitude of the location or null
 */
export function getDeviceLocation() {

    let location = null;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => { 
                location = {lat: position.coords.latitude, long: position.coords.longitude};
            },
            (error) => {
                //location = getLocationFromIP();
            }
        );
    } else {
        //location = getLocationFromIP();
    }

    return location;
}
