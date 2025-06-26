// // WeightVariantDropdown.js
import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import CreatableSelect from "react-select/creatable";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const WeightVariantDropdown = ({ value, onChange, index }) => {
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeightVariants = async () => {
    try {
      setIsLoading(true);
      const response = await Axios(SummaryApi.getallWeightVariant);
      if (response.data.success) {
        const formattedVariants = response.data.data.map(variant => ({
          value: variant.weight,
          label: variant.weight,
          id: variant._id
        }));
        setVariants(formattedVariants);
      }
    } catch (error) {
      console.log("Error fetching weight variants:", error);
      toast.error("Failed to fetch weight variants");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWeightVariant = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteWeightVariant,
        data: { id },
      });
      if (response.data.success) {
        setVariants(prev => prev.filter(v => v.id !== id));
        // If deleted option was selected, clear the selection
        if (value && value.id === id) {
          onChange(index, null, "weight");
        }
        toast.success("Weight variant deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting weight variant");
      console.log(error);
    }
  };

  const handleCreate = async (inputValue) => {
    try {
      const response = await Axios({
        ...SummaryApi.addWeightVariant,
        data: { weight: inputValue },
      });
      
      if (response.data.success) {
        const newVariant = {
          value: inputValue,
          label: inputValue,
          id: response.data.data._id
        };
        setVariants(prev => [...prev, newVariant]);
        onChange(index, newVariant, "weight");
        toast.success("Weight variant added successfully");
      }
    } catch (error) {
      toast.error("Error adding weight variant");
      console.log(error);
    }
  };

  const handleChange = (selected) => {
    onChange(index, selected, "weight"); // Pass the entire selected object to parent
  };

  // Find the currently selected option in variants
  const selectedOption = value 
    ? variants.find(option => option.value === value) || { value, label: value }
    : null;

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#eff6ff" : "white",
      color: "#1f2937",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }),
  };

  const formatOptionLabel = ({ label, id }, { context }) => {
    if (context === "menu") {
      return (
        <div className="flex justify-between items-center w-full">
          <span>{label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteWeightVariant(id);
            }}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      );
    }
    return label;
  };

  useEffect(() => {
    fetchWeightVariants();
  }, []);

  return (
    <div className="w-full max-w-sm">
      {/* <label className="block mb-1 text-gray-700 font-medium">Weight Variant</label> */}
      <CreatableSelect
      required
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={variants}
        value={selectedOption} // Pass the full option object
        placeholder="Select or create weight"
        className="text-sm"
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => "Type to create a new weight variant"}
      />
    </div>
  );
};

export default WeightVariantDropdown;

