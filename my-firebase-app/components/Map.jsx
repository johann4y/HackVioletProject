import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]); // Stores all markers
  const [newMarker, setNewMarker] = useState(null); // For the new marker being added
  const [selectedTag, setSelectedTag] = useState(""); // Stores the selected tag
  const [severity, setSeverity] = useState(0); // Stores the selected severity
  const [description, setDescription] = useState(""); // Stores the description

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Handle map click to add a marker
  const handleMapClick = (event) => {
    setNewMarker({
      position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      tag: "",
      severity: 0,
      description: "",
    });
    setSelectedTag("");
    setSeverity(0);
    setDescription("");
  };

  // Handle form submission
  const handleSubmit = () => {
    if (newMarker) {
      setMarkers((prev) => [
        ...prev,
        {
          ...newMarker,
          tag: selectedTag,
          severity,
          description,
        },
      ]);
      // Clear the new marker and inputs
      setNewMarker(null);
      setSelectedTag("");
      setSeverity(0);
      setDescription("");
    }
  };

  // Handle input changes for description
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Google Map */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={15}
          onClick={handleMapClick} // Handle clicks to add markers
        >
          {/* Render Existing Markers */}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position} />
          ))}

          {/* New Marker (Not Yet Submitted) */}
          {newMarker && <Marker position={newMarker.position} />}
        </GoogleMap>
      </LoadScript>

      {/* Marker Details Section */}
      <div className="mt-4 w-full max-w-md">
        {/* Tags Section */}
        <div className="flex gap-4 mb-4">
          {["SA", "Harassment"].map((tag) => (
            <button
              key={tag}
              onClick={() => newMarker && setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full font-bold ${
                selectedTag === tag
                  ? "bg-blue-700 text-white"
                  : "bg-gray-400 text-black"
              } ${
                !newMarker
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              disabled={!newMarker}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Severity Section */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-lg font-bold mb-2">Severity</p>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => newMarker && setSeverity(value)}
                className={`w-10 h-10 rounded-full font-bold ${
                  severity === value
                    ? "bg-red-700 text-white"
                    : "bg-gray-400 text-black"
                } ${
                  !newMarker
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
                disabled={!newMarker}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Description Box */}
        <div className="mb-4">
          <p className="text-lg font-bold mb-2">Description</p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe the incident..."
            rows="3"
            className={`w-full border-2 rounded-lg p-2 ${
              !newMarker && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!newMarker}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
            !newMarker && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!newMarker}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
