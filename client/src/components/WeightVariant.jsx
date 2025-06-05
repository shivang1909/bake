import React, { useState } from "react";
import { useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const WeightVariantManager = () => {
  const updateweightVariant = async (id, weight, giftwrapCharge) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateWeightVariant,
        data: { id, weight, giftwrapCharge },
      });
      console.log(response.data);
      if (response.data.success) {
        toast.success("Weight variant updated successfully");
      } else {
        toast.error("Error updating weight variant");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating weight variant");
    }
  };

  const deleteWeightVariant = async (id) => {
    try {
      console.log(id);
      const response = await Axios({
        ...SummaryApi.deleteWeightVariant,
        data: { id },
      });
      if (response.data.success) {
        setVariants((prev) => prev.filter((v) => v._id !== id));
        toast.success("Weight variant deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting weight variant");
      console.log(error);
    }
  };
  const fetchweightVariant = async () => {
    try {
      const response = await Axios(SummaryApi.getallWeightVariant);
      console.log(response.data);
      setVariants(response.data.data);
    } catch (error) {
      console.error("Error fetching weight variants:", error);
    }
  };
  const addweightVariant = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.addWeightVariant,
        data: newVariant,
      });
      console.log(response.data);
      if (response.data.success) {
        toast.success("Weight variant added successfully");
        setVariants((prev) => [...prev, response.data.data]);
      } else {
        toast.error("Error adding weight variant");
      }
    } catch (error) {
      console.error("Error adding weight variant:", error);
    }
  };
  useEffect(() => {
    fetchweightVariant();
  }, []);
  const [variants, setVariants] = useState([]);

  const [newVariant, setNewVariant] = useState(null);

  const handleAddRow = () => {
    setNewVariant({ weight: "", giftwrapCharge: "" });
  };

  const handleSaveNew = () => {
    if (newVariant.weight && newVariant.giftwrapCharge) {
      console.log(newVariant);
      addweightVariant(newVariant);

      setNewVariant(null);
    }
  };

  const handleDiscardNew = () => {
    setNewVariant(null);
  };

  const handleEdit = (id) => {
    setVariants((prev) =>
      prev.map((v) =>
        v._id === id
          ? {
              ...v,
              isEditing: true,
              original: { weight: v.weight, giftwrapCharge: v.giftwrapCharge },
            }
          : v
      )
    );
  };

  const handleDiscardEdit = (id) => {
    setVariants((prev) =>
      prev.map((v) =>
        v._id === id && v.original
          ? {
              ...v,
              weight: v.original.weight,
              giftwrapCharge: v.original.giftwrapCharge,
              isEditing: false,
              original: null,
            }
          : v
      )
    );
  };

  const handleUpdateChange = (id, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v._id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSaveEdit = (id) => {
    const updatedVariant = variants.find((v) => v._id === id);
    updateweightVariant(
      id,
      updatedVariant.weight,
      updatedVariant.giftwrapCharge
    );
    setVariants((prev) =>
      prev.map((v) => (v._id === id ? { ...v, isEditing: false } : v))
    );
  };

  const handleDelete = (id) => {
    deleteWeightVariant(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Weight Variant Manager</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50"
        onClick={handleAddRow}
        disabled={newVariant !== null}
      >
        + Add New
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Weight</th>
              <th className="p-3 border">Giftwrap Charge (₹)</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) =>
              v.isEditing ? (
                <tr key={v._id} className="bg-yellow-50">
                  <td className="p-3 border">
                    <input
                      type="text"
                      value={v.weight}
                      onChange={(e) =>
                        handleUpdateChange(v._id, "weight", e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-3 border">
                    <input
                      type="number"
                      value={v.giftwrapCharge}
                      onChange={(e) =>
                        handleUpdateChange(
                          v._id,
                          "giftwrapCharge",
                          e.target.value
                        )
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleSaveEdit(v._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDiscardEdit(v._id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Discard
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={v._id}>
                  <td className="p-3 border">{v.weight}</td>
                  <td className="p-3 border">₹{v.giftwrapCharge}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(v._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}

            {newVariant && (
              <tr className="bg-green-50">
                <td className="p-3 border">
                  <input
                    type="text"
                    value={newVariant.weight}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, weight: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="number"
                    value={newVariant.giftwrapCharge}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        giftwrapCharge: e.target.value,
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={handleSaveNew}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDiscardNew}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Discard
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeightVariantManager;
