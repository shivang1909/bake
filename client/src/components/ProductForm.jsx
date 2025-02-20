import React, { useRef, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';
import { setAllProduct } from '../store/productSlice';
import CategorySelect from './CategorySelect';


const ProductForm = ({close, isEdit = false, updatedata}) => {
  console.log(updatedata);
  
  const usedispatch = useDispatch();
  
  const allProduct = useSelector(state => state.product.Allproduct);
  const allCategory = useSelector(state => state.product.allCategory)
  

  const [selectedCategory, setSelectedCategory] = useState(false);

  const [data, setData] = useState({
    _id: isEdit ? updatedata._id : "",
    name: isEdit ? updatedata.name : "",
    coverimage: isEdit ? updatedata.coverimage : null,
    image: isEdit ? updatedata.image : [],
    category: isEdit ? updatedata.category : allCategory[0]._id,
    // discount: isEdit ? updatedata.discount : "",
    description: isEdit ? updatedata.description : "",
    more_details: isEdit ? updatedata.more_details || {} : {},
    weightVariants: isEdit ? updatedata.weightVariants : [{ weight: '', price: '', qty: '', discount:''}],
    sku_code: isEdit ? updatedata.sku_code : "",
    checkcategory: false,
  });
  const [imagePreview, setImagePreview] = useState(data.image);
  console.log(data);
  const [newimage, setNewImage] = useState([]); // Stores newly selected images for update  
const imageRef = useRef(null); // Reference for file input  
const blobimages = useRef([]); // Stor
  const [coverimaepreview, setCoverImagepreview] = useState(data.coverimage)
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  
  console.log(data);
  const file1 = useRef(null)

 // Handle adding weight variants (weight, price, qty)
//  const handleAddWeightVariant = () => {
//   const newWeightVariant = { weight: '', price: '', qty: '' };
//   setData((prev) => ({
//     ...prev,
//     weightVariants: [...prev.weightVariants, newWeightVariant]
//   }));
// };
// Handle adding weight variants (weight, price, qty, discount)
const handleAddWeightVariant = () => {
  const newWeightVariant = { weight: '', price: '', qty: '', discount: 0 }; // Added discount with default value 0
  setData((prev) => ({
    ...prev,
    weightVariants: [...prev.weightVariants, newWeightVariant]
  }));
};

 // Handle change in weight variant fields
//  const handleWeightVariantChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedWeightVariants = [...data.weightVariants];
//     updatedWeightVariants[index][name] = value;
//     setData((prev) => ({
//       ...prev,
//       weightVariants: updatedWeightVariants
//     }));
//   };

const handleWeightVariantChange = (index, e) => {
  const { name, value } = e.target;

  // Create a deep copy of the weight variants array
  const updatedWeightVariants = data.weightVariants.map((variant, i) =>
    i === index ? { ...variant, [name]: value } : variant
  );

  // Update the state with the modified array
  setData((prev) => ({
    ...prev,
    weightVariants: updatedWeightVariants,
  }));
};

  const addUpload = (e) =>{
    console.log("handleUploadImage")
    const files =  file1.current.files;
    var allselectedfiles = [];
    Array.from(files).forEach((element) => {
    allselectedfiles.push(element);      
      
    });
    console.log(allselectedfiles);
    file1.current.value = "";
    var duplicateName = null;
      const hasDuplicate = allselectedfiles.some((newFile) => {
        const isDuplicate = data.image.some((existingFile) => existingFile.name === newFile.name);
        if (isDuplicate) {
          duplicateName = newFile.name; // Capture the duplicate file name
        }
        return isDuplicate;
      });
    if(hasDuplicate){
      alert(`${duplicateName} is already there, please select new images.`);

      return;
    }
    setData((preve) =>  {
     return { 
     ...preve,
     image: [...preve.image, ... allselectedfiles],
     };
   });
    setImagePreview((prev) => [...prev, ...allselectedfiles.map((file) => URL.createObjectURL(file))]);
  }

 
  const handleUploadCoverImage = (e) => {   
    setCoverImagepreview(URL.createObjectURL(e.target.files[0]));
    console.log("handle upload cover image")
      setData((preve) => {
        return {
          ...preve,
          coverimage: e.target.files[0]
        };
       });
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  
  const handleEditUpload = async (e) => {
    console.log("Editing Upload...");
  
    const files = file1.current.files; // Use file1 for Edit mode
    const allSelectedFiles = Array.from(files);
    
    const imageNames = data.image.map((image) => image.split("/").pop()); // Extract existing image names
    const newImageNames = newimage.map((file) => file.name); // Names of newly selected images
    
    let duplicateName = null;
    const hasDuplicate = allSelectedFiles.some((newFile) => {
      if (imageNames.includes(newFile.name) || newImageNames.includes(newFile.name)) {
        duplicateName = newFile.name;
        return true;
      }
      return false;
    });
  
    if (hasDuplicate) {
      alert(`${duplicateName} is already there, please select new images.`);
      return;
    }
  
    file1.current.value = ""; // Clear input after selecting images
  
    const newPreviews = allSelectedFiles.map((file) => URL.createObjectURL(file));
  
    setImagePreview((prev) => [...prev, ...newPreviews]);
    setNewImage((prev) => [...prev, ...allSelectedFiles]);
  
    blobimages.current.push(...newPreviews);
    console.log(blobimages);
  };
  
  const handleUploadImage = async (e) => {
    if (isEdit) {
      handleEditUpload(e);
    } else {
      addUpload(e);
    }
  };
  
  const deletepreviw = async (updatedPreviews) => {
    if (file1.current) {
      console.log(file1.current.value)
      file1.current.value = "";

    }
    await setImagePreview(updatedPreviews)
  }
  const handleDeleteImage = async (index) => {
    // Create new arrays instead of mutating the existing ones
    const updatedImages = [...data.image];
    const updatedPreviews = [...imagePreview];
    console.log(file1.current.value)
    // Remove the item at the specified index
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    console.log(updatedImages)
    console.log(updatedPreviews)
    await deletepreviw(updatedPreviews);
    // Update the `imagePreview` state
    console.log(imagePreview)
    setData((prev) => ({
      ...prev,
      image: updatedImages, // Update the `data.image` property
    }));

  };

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }
const handleSubmit = (e) => {
  if (isEdit) {
    handleEditProduct(e); // Call the edit handler if it's an edit action
  } else {
    handleAddProduct(e); // Call the add handler if it's an add action
  }
};


const handleCategoryChange = (e) => {
  const selectedCategoryId = e.target.value;
    console.log("this is function")
  // Find the selected category object from `allCategory`
  const selectedCategory = allCategory.find(c => c._id === selectedCategoryId);

  console.log("Selected Category:", selectedCategory);

  // Update the state with the selected category object
  setData((prev) => ({
    ...prev,
    category: selectedCategory || null, // Ensure category is set to the object or null
    checkcategory: !!selectedCategory // Converts to `true` if category exists, otherwise false
  }));
};


const handleEditProduct = async (e) => {
  e.preventDefault()
  
  console.log("data", data)
  const formData = new FormData();
  formData.append("_id", data._id);
  formData.append("name", data.name);

  if (data.checkcategory && data.category) {
      formData.append("category", data.category._id); // ✅ Send only the ObjectId
      } else if (data.category?._id) {
    formData.append("category", data.category._id);
  }

  formData.append("coverimage", data.coverimage);
  // formData.append("discount", data.discount);
  formData.append("description", data.description);
  formData.append("more_details", JSON.stringify(data.more_details));
  formData.append("weightVariants", JSON.stringify(data.weightVariants));
  formData.append("sku_code", data.sku_code);

  data.image.forEach((url) => {
    formData.append("existedImage", url);
  });
  // Append files
  newimage.forEach((file) => {
    console.log(imagePreview)
    formData.append("image", file); // Field name 'image' must match `upload.array("image")`
  });
  console.log(data)
  console.log(formData);
  
  console.log(newimage);

  try {
    const response = await Axios({
      ...SummaryApi.updateProductDetails,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { data: responseData } = response;
    if (responseData.success) { 
      console.log(data.category);
      
      const updatedData = {
        ...data,
        // category: data.checkcategory ? { ...data.category } : data.category._id, 
        // category: data.checkcategory ? data.category  : data.category._id, // Ensures a new object reference
        image: blobimages.current.length > 0 ?  [...data.image, ...blobimages.current] : data.image,
        coverimage: data.coverimage instanceof File ? coverimaepreview : data.coverimage,
      };
console.log(updatedData);

const updatedproducts = allProduct.map((product) =>
        product._id === updatedData._id ? updatedData : product
    );
    console.log('updated products' ,updatedproducts);
    
    usedispatch(setAllProduct([...updatedproducts]));
    console.log(allProduct);
      successAlert(responseData.message);
      if (close) close();
      // fetchProductData();
      setData({
        name: "",
        image: [],
        category: null,
        // discount: "",
        description: "",
        more_details: {},
        weightVariants: [],
        sku_code: "",
      });
    }
  } catch (error) {
    console.log(error);
    
    AxiosToastError(error);
  }

}
// ==============================================
  const handleAddProduct = async (e) => {
    e.preventDefault()
    setSelectedCategory(false);
    setCoverImagepreview(null);  
    setImagePreview([]);

    console.log("-------");
    console.log(data.image)
    const formdata = new FormData();
    formdata.append("name", data.name)

    // formdata.append("category", data.category)
    formdata.append("category", data.category?._id || data.category);  // Ensure `_id` is passed, or fallback to `data.category` if it's already an ID

    // console.log("display category",data.category);
    
    formdata.append("unit", data.unit)
    formdata.append("stock", data.stock)
    formdata.append("price", data.price)
    // formdata.append("discount", data.discount)
    formdata.append("description", data.description)
    const md = JSON.stringify(data.more_details);
    formdata.append("coverimage", data.coverimage)
    formdata.append("more_details", md)
    formdata.append("weightVariants", JSON.stringify(data.weightVariants)); // Append weightVariants
    formdata.append("sku_code", data.sku_code)


    for (let i = 0; i < data.image.length; i++) {
      formdata.append("image", data.image[i]);
    }

    console.log(formdata)
    for (const [key, value] of formdata) {
      if (key === "image") {
        console.log(typeof value)
        console.log(`key = ${key} and values are ${value}`)
      }
    }
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      })
      const { data: responseData } = response

      if (responseData.success) {
        const updatedProduct = {
          ...responseData.data,
          coverimage: coverimaepreview,
        
        }
        usedispatch(setAllProduct([...allProduct, responseData.data]));
        console.log(responseData.data);
        console.log(allProduct);
      
        successAlert(responseData.message)
        // toast.success(responseData.message);
                close();
        setData({
          name: "",
          image: [],
          category: 0,
          coverimage: null,
          // discount: "",
          description: "",
          more_details: {},
          weightVariants: [] ,// Reset weightVariants
          sku_code: "", // Reset sku_code
        })

      }
    } catch (error) {
      console.log(error);
      
      AxiosToastError(error)
    }
  }

  return (
    <section className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto rounded-lg shadow-lg'>
        <div className='flex items-center justify-between p-2 bg-white shadow-md'>
          <h2 className='font-semibold text-lg'>
      {isEdit ? "Update Product" : "Add product"}
          </h2>
          <button onClick={close} className='text-gray-600 hover:text-gray-900'>
            <IoClose size={25} />
          </button>
        </div>
  
        <div className='grid p-3'>
          <form className='grid gap-4' method='post' onSubmit={handleSubmit} encType='multipart/form-data'>
            
            {/* Name Section */}
            <div className='grid gap-1'>
              <label htmlFor='name' className='font-medium'>Name</label>
              <input
                id='name'
                type='text'
                placeholder='Enter product name'
                name='name'
                value={data.name}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
  
            {/* Description Section */}
            <div className='grid gap-1'>
              <label htmlFor='description' className='font-medium'>Description</label>
              <textarea
                id='description'
                type='text'
                placeholder='Enter product description'
                name='description'
                value={data.description}
                onChange={handleChange}
                required
                rows={3}
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
              />
            </div>
  
            {/* SKU Code Section */}
            <div className='grid gap-1'>
              <label htmlFor='sku_code' className='font-medium'>Enter SKU code</label>
              <input
                id='sku_code'
                type='text'
                placeholder='Enter SKU code'
                name='sku_code'
                value={data.sku_code}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
  
            {/* Cover Image Section */}
            <div>
              
              <p className='font-medium'>Cover Image</p>
              <div>
                <label htmlFor='CoverImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                  <div className='text-center flex justify-center items-center flex-col'>
                    
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Cover Image</p>

                  </div>
                  <input
                    type='file'
                    name="CoverImage"
                    id='CoverImage'
                    className='hidden'
                    accept='image/*'
                    onChange={handleUploadCoverImage}
                  />
                </label>
                <div className="flex flex-wrap gap-4">
                  {coverimaepreview ? (
                    <div key={coverimaepreview} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group">
                      <img
                        src={coverimaepreview}
                        alt="Preview"
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(coverimaepreview)}
                      />
                    </div>
                  ) : (
                    <p>No images to display</p>
                  )}
                </div>
              </div>
            </div>
  
            {/* Product Image Section */}
            <div>
              <p className='font-medium'>Image</p>
              <div>
                <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                  <div className='text-center flex justify-center items-center flex-col'>
                    
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      
                  </div>
                  <input
                    ref={file1}
                    type='file'
                    name="image"
                    id='productImage'
                    className='hidden'
                    accept='image/*'
                    multiple
                    onChange={handleUploadImage}
                  />
                </label>
                <div className="flex flex-wrap gap-4">
                  {imagePreview && imagePreview.length > 0 ? (
                    imagePreview.map((image, index) => (
                      <div key={image + index} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group">
                        <img
                          src={image}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-scale-down cursor-pointer"
                          onClick={() => setViewImageURL(image)}
                        />
                        <div
                          onClick={() => handleDeleteImage(index)}
                          className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                        >
                          <MdDelete />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No images to display</p>
                  )}
                </div>
              </div>
            </div>
    

<div className="grid gap-1">
  <label className="font-medium">Category</label>
  <div>

    {console.log(data.category)}
    {console.log(data.category._id)}
    {console.log(selectedCategory)}
    
<CategorySelect
  selectedCategory={selectedCategory}
  allCategory={allCategory}
  handleCategoryChange={handleCategoryChange}
  data={data}
  isEdit={isEdit}
/>
  
  </div>
</div>

{/* ========================= */}
        <div>
            <p className='font-medium'>Weight Variants</p>
            {data.weightVariants.map((variant, index) => (
              <div key={index} className='flex gap-4 mb-2'>
                {/* Weight Field */}
                <div className='flex-1'>
                  <input
                    type='text'
                    name='weight'
                    placeholder='Weight in Grms'
                    value={variant.weight}
                    onChange={(e) => handleWeightVariantChange(index, e)}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded w-full'
                  />
                </div>

                {/* Price Field */}
                <div className='flex-1'>
                  <input
                    type='number'
                    name='price'
                    placeholder='Price'
                    value={variant.price}
                    onChange={(e) => handleWeightVariantChange(index, e)}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded w-full'
                  />
                </div>

                {/* Quantity Field */}
                <div className='flex-1'>
                  <input
                    type='number'
                    name='qty'
                    placeholder='Quantity'
                    value={variant.qty}
                    onChange={(e) => handleWeightVariantChange(index, e)}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded w-full'
                  />
                </div>
                {/* Discount Field */}
                 <div className='flex-1'>
                  <input
                    type='number'
                    name='discount'
                    placeholder='Discount'
                    value={variant.discount} // Ensures default value of 0 is displayed
                    onChange={(e) => handleWeightVariantChange(index, e)}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded w-full'
                  />
                </div>

                {/* Remove Button */}
                <button
                type="button"
                onClick={() => {
                  if (data.weightVariants.length <= 1) {
                    // Call AxiosToastError with a custom error message
                    AxiosToastError({
                      response: {
                        data: {
                          message: "Cannot remove the last weight variant." // Custom error message
                        }
                      }
                    });
                    return; // Prevent removal if there's only one row
                  }
                  // If there are multiple rows, allow removal
                  const updatedVariants = data.weightVariants.filter((_, i) => i !== index);
                  setData((prev) => ({ ...prev, weightVariants: updatedVariants }));
                }}
                className="text-red-600 mt-2"
              >
                Remove
              </button>

              </div>
            ))}
            <button type="button" onClick={handleAddWeightVariant} className='bg-primary-100 hover:bg-primary-200 py-1 rounded'>
              Add Weight Variant
            </button>
          </div>
  
            {/* Add More Fields Section */}
            {Object?.keys(data?.more_details)?.map((k, index) => (
              <div className='grid gap-1' key={index}>
                <label htmlFor={k} className='font-medium'>{k}</label>
                <input
                  id={k}
                  type='text'
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      more_details: {
                        ...prev.more_details,
                        [k]: value,
                      },
                    }));
                  }}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
            ))}
  
            <div onClick={() => setOpenAddField(true)} className='bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
              Add Fields
            </div>
  
            {/* Submit Button */}
            <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
              Submit
            </button>
          </form>
        </div>
  
        {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
        {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </section>
  );
  
}

export default ProductForm