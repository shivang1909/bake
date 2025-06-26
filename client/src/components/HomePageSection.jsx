import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/SummaryApi";
import SummaryApi from "../common/SummaryApi";

import { toast } from "react-hot-toast";
const HomepageSectionList = () => {
  const [sections, setSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // State to track if it's an edit operation

  const [newSection, setNewSection] = useState({
    _id: "",
    sectionName: "",
    visible: true,
    productIds: [], // IDs of selected products
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
   const HandleCancel = () => { 
      setShowModal(false);  
      setNewSection({
        _id: "",
        sectionName: "",
        visible: true,
        productIds: [],
      });
      setIsEdit(false); // Reset edit mode
      setSelectedProducts([]);
      setAvailableProducts(products); // Reset available products to all products 
  }
  // Fetch Sections API
  const fetchSections = async () => {
    try {
      const res = await Axios(summaryApi.getallHomepageSection);
      console.log(res.data)
      setSections(res.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Fetch Products API
  const fetchProducts = async () => {
    try {
      const res = await Axios(summaryApi.getallProduct);
      console.log(res.data.data)
      console.log("fetchting products")
      setProducts(res.data.data)
      setAvailableProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchProducts();
  }, []);
  const handleEdit = async (section)=>{
    setShowModal(true);
    setIsEdit(true); // Set edit mode to true
    setNewSection({
      _id: section._id,
      sectionName: section.sectionName,
      visible: section.visible,
      productIds: section.productIds,
    });
    console.log('this is section ',section)
    console.log('Section productIds:', section.productIds);

console.log('Available products:', products.map(p => p._id));
   
    setSelectedProducts(section.productIds.map((id) => products.find((p) => p._id === id)));   
  
    setAvailableProducts((prev) =>
      prev.filter((product) => !section.productIds.includes(product._id))
    ); 

  }
  const handleDelete = async (id) => {
    try {
      const res = await Axios({
        ...SummaryApi.deleteHomePageSection,
        data: { sectionId: id },
      });
      console.log("Delete Response:", res.data);
      if (res.data.success) {
        setSections((prev) => prev.filter((section) => section._id !== id));
        toast.success("Section deleted successfully");
      } else {
        toast.error("Error deleting section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Error deleting section");
    }
  } 

  // Handle the addition of a product to the selected list
  const handleSelect = (id) => {
    // Find the product by its ID
    const selectedProduct = availableProducts.find((p) => p._id === id);

    // Remove selected product from available products
    setAvailableProducts((prev) =>
      prev.filter((product) => product._id !== id)
    );

    // Add selected product to selected products list
    setSelectedProducts((prev) => [...prev, selectedProduct]);

    // Update the productIds array in newSection state
    setNewSection((prev) => ({
      ...prev,
      productIds: [...prev.productIds, id],
    }));
  };

  // Handle the removal of a product from the selected list
  const handleDeselect = (id) => {
    // Find the product by its ID
    console.log("handle deselect and id  ",id);

    console.log(selectedProducts)
    const deselectedProduct = selectedProducts.find((p) => p._id === id);
    // Remove deselected product from selected products list
    setSelectedProducts((prev) =>
      prev.filter((product) => product._id !== id)
    );

    // Add deselected product back to available products list
    setAvailableProducts((prev) => [...prev, deselectedProduct]);

    // Update the productIds array in newSection state
    setNewSection((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((pid) => pid !== id),
    }));
  };
  const updateSection = async () => {
       try {
          

        const res = await Axios({
          ...SummaryApi.updatehomepageSection,

          data: {
            sectionId: newSection._id,
            sectionName: newSection.sectionName,
            productIds: newSection.productIds,
            visible: newSection.visible,
          },
        });
        console.log("Update Response:", res.data);
        // Check if the update was successful
        if (res.data.success) {
          setSections((prev) =>
            prev.map((section) =>
              section._id === newSection._id ? { ...section, ...newSection } : section
            )
          );
         setAvailableProducts(products); // Reset available products to all products
          setNewSection({
            _id: "",
            sectionName: "",
            visible: true,
            productIds: [],
          });
           setIsEdit(false); // Reset edit mode
          setSelectedProducts([]);
          toast.success("Section updated successfully");
        } else {
          toast.error("Error updating section");
        }
        setShowModal(false);
        setNewSection({
          _id: "",
          sectionName: "",
          visible: true,
          productIds: [],
        });
       } catch (error) {
        console.error("Error updating section:", error);
        toast.error("Error updating section");
       }
  }
  // Handle form submission to add a new section
  const handleAddSection = async () => {
    if (!newSection.sectionName) return alert("Section name required");

    try {
     console.log("Adding new section:", newSection);
      
      const res = await Axios({...SummaryApi.addHomePageSection, data: newSection});
    
      console.log(res)
      setNewSection({
        sectionName: "",
        visible: true,
        productIds: [],
      });
      toast.success("Section added successfully");
     
      setSections((prev)=> [...prev, res.data])
      setSelectedProducts([])
        setAvailableProducts(products); // Reset available products to all products 
      

    } catch (error) {
      console.log(error);
      toast.error("Error adding section");
      setNewSection({
        sectionName: "",
        visible: true,
        productIds: [],
      });
    }
    
    
    setShowModal(false);
    
    setSearchTerm("");
  };

  const filteredProducts = availableProducts.filter((p) =>
    p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()) // Ensure title exists before calling toLowerCase()
  );
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Homepage Sections</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="text-gray-500">No sections found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Section</th>
              <th className="border p-2">Products</th>
              <th className="border p-2">Visible</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              
              <tr key={section._id} className="text-center">
                <td className="border p-2">{section.sectionName}</td>
                <td className="border p-2">{section.productIds.length}</td>
                <td className="border p-2">
                  {section.visible ? "✅" : "❌"}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(section)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(section._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for adding a section */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto pt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h3 className="text-xl font-semibold mb-4">Add Homepage Section</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1">Section Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newSection.sectionName}
                  onChange={(e) =>
                    setNewSection({ ...newSection, sectionName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Visible</label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newSection.visible}
                    onChange={(e) =>
                      setNewSection({ ...newSection, visible: e.target.checked })
                    }
                  />
                  <span>{newSection.visible ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Search Products</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Available Products */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Available Products</h4>
                  <div className="border rounded p-2 h-48 overflow-y-auto bg-gray-50">
                    
                    {filteredProducts.map((product) => (


                    <div
                        key={product._id}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>{product.name}</span>
                        <button
                          onClick={() => handleSelect(product._id)}
                          className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Products */}
                <div>
                  <h4 className="font-semibold mb-2">Selected Products</h4>
                  <div className="border rounded p-2 h-48 overflow-y-auto bg-gray-50">
                  {console.log(selectedProducts)}
                    {selectedProducts.map((product) => (
    product && (  // Only render if product exists
      <div
        key={product._id}
        className="flex justify-between items-center mb-2"
      >
        <span>{product.name}</span>
        <button
          onClick={() => handleDeselect(product._id)}
          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    )
  ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => HandleCancel()}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? updateSection: handleAddSection  }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {isEdit ? "Update Section" : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageSectionList;

