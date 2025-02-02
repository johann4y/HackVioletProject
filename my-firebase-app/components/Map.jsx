import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { auth } from "../lib/firebase.js";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const blueMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [severity, setSeverity] = useState(0);
  const [description, setDescription] = useState("");
  const [userPins, setUserPins] = useState([]);
  const [username, setUsername] = useState(auth.currentUser?.email);
  const [activeMarker, setActiveMarker] = useState(null);

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
    <div className="flex flex-col items-center p-4">
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
            icon={blueMarkerIcon}
            onMouseOver={() => setActiveMarker(marker)} // Set active marker on hover
            onMouseOut={() => setActiveMarker(null)} // Reset active marker when mouse leaves
          >
            {activeMarker === marker && (
              <InfoWindow position={marker.position} onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <p><strong>Description:</strong> {marker.description}</p>
                  <p><strong>Severity:</strong> {marker.severity}</p>
                  <p><strong>Tags:</strong> {marker.tags.join(", ")}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        {newMarker && <Marker position={newMarker.position} />}
      </GoogleMap>

     

      <div className="grid grid-cols-2  gap-10  w-full max-w-[1300px] pt-4">
      <div className=" w-full  p-4">
        <h1 className="text-center font-bold text-xl pb-4 underline">Pin Submission Form</h1>
        <h2 className="text-center text-lg font-bold pb-4">Tags</h2>
        <div className="flex gap-4 justify-center mb-4">
          {["Assault", "Harassment", "Sketchy", "Crime", "Other"].map((tag) => (
            <button
              key={tag}
              onClick={() => newMarker && toggleTag(tag)}
              className={`px-4 py-2 rounded-full font-bold ${
                selectedTags.includes(tag)
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-black"
              } ${
                !newMarker
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600 hover:text-white"
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
                    ? "bg-red-400 text-white"
                    : "bg-gray-200 text-black"
                } ${
                  !newMarker
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-500 hover:text-white"
                }`}
                disabled={!newMarker}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg font-bold pb-2 text-white">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            rows="3"
            className={`w-full border-2 text-white rounded-lg p-2 ${
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
        <button onClick={fetchPins} className="w-full bg-gray-500 hover:bg-black text-white font-bold py-2 px-4 rounded mt-4">
          Refresh
        </button>
      </div>

    
      <div className="w-full  bg-white py-5 rounded-lg px-5">
        <h2 className="text-xl font-bold pb-5 text-center">Your Markers</h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4">
          {userPins.length == 0 ? (
            <p className="text-gray-600 text-center">Create Some Pins!</p>
          ) : (
            userPins.map((pin) => (
              <div
                key={pin._id}
                className="flex justify-between items-center p-4 border-b last:border-none"
              >
                <div>
                  <p>
                    <strong>Description:</strong> {pin.description}
                  </p>
                  <p>
                    <strong>Severity:</strong> {pin.severity}
                  </p>
                  <p>
                    <strong>Tags:</strong> {pin.tags.join(", ")}
                  </p>
                  <p>
                    <strong>Created:</strong> {pin.creationDate}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePin(pin._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded"
                >
                  Delete Pin
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      </div>
    </div>
  );
}
