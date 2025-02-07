const CategorySelect = ({ selectedCategory, allCategory, handleCategoryChange, data, isEdit }) => {
  return (
    
    <>
    { 
      console.log("re rebnder")
    }
    <select
      className="bg-blue-50 border w-full p-2 rounded"
      value={data.category?._id || data.category} // Handle both cases
      onChange={handleCategoryChange}
      >
      {!selectedCategory && !isEdit && <option value="">Select category</option>}
      {allCategory.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
      </>
  );
};

export default CategorySelect;
