import React from "react";

const CategorySelect = ({ allCategory, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="grid gap-1">
      <label className="font-medium">Category</label>
      <div>
        {console.log(selectedCategory._id)}

        <select
          className="bg-blue-50 border w-full p-2 rounded"
          // value={selectedCategory || ""} // Ensure we store `_id`
          value={selectedCategory ? selectedCategory._id : ""}

          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedCategory(selectedId ? selectedId : ""); // Ensure `_id` is stored
          }}
        >
          <option value="">Select category</option>
          {allCategory.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategorySelect;
