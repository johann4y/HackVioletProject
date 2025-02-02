import { useState } from "react";
import { createPin } from "../services/pinService";

export default function PinForm() {
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    severity: 1,
    tags: [],
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPin(formData);
      alert("Pin created successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Latitude"
        value={formData.lat}
        onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={formData.lng}
        onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
      />
      <select
        value={formData.severity}
        onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            Severity {num}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <button type="submit">Create Pin</button>
    </form>
  );
}