import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { auth } from '../lib/firebase.js';
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const blueMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

export default function Map({ isLoaded, mapKey }) {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [severity, setSeverity] = useState(0);
  const [description, setDescription] = useState("");
  const [activeMarker, setActiveMarker] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [username, setUsername] = useState(auth.currentUser?.email);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.email);
        fetchPins();
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);



  const fetchPins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pins");
      const transformedMarkers = response.data.map((pin) => ({
        ...pin,
        position: { lat: pin.latitude, lng: pin.longitude },
      }));
      setMarkers(transformedMarkers);
      setUserPins(transformedMarkers.filter((pin) => pin.createdBy === username));
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  useEffect(() => {
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

  const handleMapClick = (event) => {
    setNewMarker({
      position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      tags: [],
      severity: 0,
      description: "",
    });
    setSelectedTags([]);
    setSeverity(0);
    setDescription("");
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!newMarker || !description || severity === 0 || selectedTags.length === 0) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const pinData = {
        latitude: newMarker.position.lat,
        longitude: newMarker.position.lng,
        createdBy: username,
        tags: selectedTags,
        severity,
        description,
      };
      const response = await axios.post("http://localhost:5000/api/pins", pinData);
      setMarkers((prev) => [...prev, response.data]);
      setUserPins((prev) => [...prev, response.data]);
      fetchPins();
      setNewMarker(null);
      setSelectedTags([]);
      setSeverity(0);
      setDescription("");
    } catch (error) {
      console.error("Error creating pin:", error);
    }
  };

  const handleDeletePin = async (pinId) => {
    try {
      await axios.delete(`http://localhost:5000/api/pins/${pinId}`, { data: { createdBy: username } });
      setMarkers((prev) => prev.filter((pin) => pin._id !== pinId));
      setUserPins((prev) => prev.filter((pin) => pin._id !== pinId));
      fetchPins();
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  return (
    <div className=" flex flex-col items-center p-4">
      
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={15}
            onClick={handleMapClick}
          >
            {markers.map((marker) => (
              <Marker
                key={marker._id}
                position={marker.position}
                onMouseOver={() => setActiveMarker(marker)}
                onMouseOut={() => setActiveMarker(null)}
                icon={blueMarkerIcon}
              >
                {activeMarker && (
              <InfoWindow
                position={activeMarker.position}
                onCloseClick={() => setActiveMarker(null)}
                
              >
                <div className="text-black">
                  <p><strong>Description:</strong> {activeMarker.description}</p>
                  <p><strong>Severity:</strong> {activeMarker.severity}</p>
                  <p><strong>Tags:</strong> {activeMarker.tags.join(", ")}</p>
                </div>
              </InfoWindow>
            )}
                </Marker>
            ))}
            {newMarker && <Marker position={newMarker.position} />}
            
          </GoogleMap>
        

      {/* Marker Details Section */}
      <div className="mt-4 w-full max-w-md">
        <div className="flex gap-4 mb-4">
          {["SA", "Harassment", "Sketchy"].map((tag) => (
            <button
              key={tag}
              onClick={() => newMarker && toggleTag(tag)}
              className={`px-4 py-2 rounded-full font-bold ${
                selectedTags.includes(tag)
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

        <div className="mb-4">
          <p className="text-lg font-bold mb-2">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            rows="3"
            className={`w-full border-2 rounded-lg p-2 ${
              !newMarker && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!newMarker}
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
            !newMarker && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!newMarker}
        >
          Submit
        </button>

        <button
          onClick={fetchPins}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Refresh Pins
        </button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Your Pins</h2>
        {userPins.map((pin) => (
          <div
            key={pin._id}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <p><strong>Description:</strong> {pin.description}</p>
              <p><strong>Severity:</strong> {pin.severity}</p>
              <p><strong>Tags:</strong> {pin.tags.join(", ")}</p>
            </div>
            <button
              onClick={() => handleDeletePin(pin._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}