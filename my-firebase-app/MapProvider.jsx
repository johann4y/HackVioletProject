import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";

const MapProvider = ({ children }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      onLoad={() => setIsLoaded(true)}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isLoaded })
      )}
    </LoadScript>
  );
};

export default MapProvider;