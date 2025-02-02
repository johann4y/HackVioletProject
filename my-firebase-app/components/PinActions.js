import { useState } from "react";
import { updatePin, deletePin } from "../services/pinService";

export default function PinActions({ pinId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    severity: 1,
    description: "",
  });

  const handleUpdate = async () => {
    try {
      await updatePin(pinId, updatedData);
      alert("Pin updated successfully!");
      setIsEditing(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      try {
        await deletePin(pinId);
        alert("Pin deleted successfully!");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <select
            value={updatedData.severity}
            onChange={(e) =>
              setUpdatedData({ ...updatedData, severity: parseInt(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                Severity {num}
              </option>
            ))}
          </select>
          <textarea
            value={updatedData.description}
            onChange={(e) =>
              setUpdatedData({ ...updatedData, description: e.target.value })
            }
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}