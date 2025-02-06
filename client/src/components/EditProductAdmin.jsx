import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setAllProduct } from '../store/productSlice';
  // const [data, setData] = useState({
  //   name: "",
  //   image: [],
  //   category: 0,
  //   coverimage: null,
  //   discount: "",
  //   description: "",
  //   more_details: {}, 
  //   weightVariants: [],
  //   sku_code: "", // New field for weight variants
  // })

const EditProductAdmin = ({ close ,data : propsData}) => {
  const dispatch = useDispatch();
  const blobimages = useRef([]); 

  const user = useSelector(state => state.user)
  console.log(user);
  const allProduct = useSelector(state => state.product.Allproduct)
   console.log(allProduct);
  const [data, setData] = useState({
    _id : propsData._id,
    name: propsData.name,
    coverimage: propsData.coverimage,
    image: propsData.image,
    category: propsData.category,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
    weightVariants: propsData.weightVariants || [],
    sku_code: propsData.sku_code,
    checkcategory: false
  })
  console.log(propsData)

  const [imagePreview, setImagePreview] = useState([]);
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  console.log(data)
  console.log(`this is image previw ${imagePreview[0]}`);
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [newimage, setNewImage] = useState([]);
  const [coverimaepreview, setCoverImagepreview] = useState(propsData.coverimage)
    const imageRef = useRef();
    
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
useEffect(() => {
     console.log(data);
     setImagePreview([...data.image]);
},[])

  
  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }
    
  const handleUploadImage = async (e) => {
    const files = imageRef.current.files;
    console.log(files);
  
    // Convert FileList to an array
    const allSelectedFiles = Array.from(files);
    const newBlobs = allSelectedFiles.map((file) => URL.createObjectURL(file));
    // blobimages =  allSelectedFiles.map((file) => URL.createObjectURL(file));
    // Fetch only the names of existing images (from `data.image`)
    const imageNames = data.image.map((image) => {
      const parts = image.split('/');
      return parts[parts.length - 1]; // Extract the image name
    });
  
    // Fetch the names of already selected new images (from `newimage`)
    const newImageNames = newimage.map((file) => file.name);
  
    // Check for duplicates
    let duplicateName = null;
    const hasDuplicate = allSelectedFiles.some((newFile) => {
      if (imageNames.includes(newFile.name) || newImageNames.includes(newFile.name)) {
        duplicateName = newFile.name; // Capture the duplicate file name
        return true; // Stop checking further
      }
      return false;
    });
    
    // If a duplicate is found, show an alert with the duplicate name
    if (hasDuplicate) {
      alert(`${duplicateName} is already there, please select new images.`);
      return;
    }
    
    blobimages.current.push(...newBlobs);  // Add new blobs to the existing array

    console.log(blobimages);
    // Create preview URLs for the new images
    const newPreviews = allSelectedFiles.map((file) => URL.createObjectURL(file));
  
    // Update state with new previews and files
    setImagePreview((prev) => [...prev, ...newPreviews]);
    setNewImage((prev) => [...prev, ...allSelectedFiles]);
  
    // Clear the file input
    imageRef.current.value = "";
  };

  const handleWeightChange = (index, field, value) => {
    const updatedVariants = [...data.weightVariants];
    updatedVariants[index][field] = value;
    setData((prevData) => ({
      ...prevData,
      weightVariants: updatedVariants,
    }));
  };

  const handleAddWeightVariant = () => {
    setData((prevData) => ({
      ...prevData,
      weightVariants: [...prevData.weightVariants, { weight: '', price: '', qty: ''  }],
    }));
  };

  const handleDeleteWeightVariant = (index) => {
    const updatedVariants = data.weightVariants.filter((_, i) => i !== index);
    setData((prevData) => ({
      ...prevData,
      weightVariants: updatedVariants,
    }));
  };


const handleDeleteImage = (index) => {
  console.log(`this is index ${index}`);
  setImagePreview((prevPreview) => prevPreview.filter((_, imgIndex) => imgIndex !== index));
  if(index>=data.image.length){
  const datalength = Math.abs(index - data.image.length);
  setNewImage((prevNewImage) => prevNewImage.filter((_, imgIndex) => imgIndex !== datalength));
 return;
}
  setData((prevData) => ({
    ...prevData,
    image: prevData.image.filter((_, imgIndex) => imgIndex !== index),
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

const handleCategoryChange = (e) => {
  const selectedCategoryId = e.target.value;

  // Find the selected category object from `allCategory`
  const selectedCategory = allCategory.find(c => c._id === selectedCategoryId);

  console.log("Selected Category:", selectedCategory);

  setData((prev) => ({
    ...prev,
    category: selectedCategory || null, // Ensure category is set
    checkcategory: !!selectedCategory // Converts to `true` if category exists
  }));
  
};


  const handleSubmit = async (e) => {
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
    formData.append("discount", data.discount);
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
          category: data.checkcategory ? { ...data.category } : data.category._id, 

          // category: data.checkcategory ? data.category  : data.category._id, // Ensures a new object reference
          image: blobimages.current.length > 0 ?  [...data.image, ...blobimages.current] : data.image,
          coverimage: data.coverimage instanceof File ? coverimaepreview : data.coverimage,
        };
  console.log(updatedData);
  
  const updatedproducts = allProduct.map((product) =>
          product._id === updatedData._id ? updatedData : product
      );
      console.log('updated products' ,updatedproducts);
      
      dispatch(setAllProduct([...updatedproducts]));
      console.log(allProduct);
        successAlert(responseData.message);
        if (close) close();
        // fetchProductData();
        setData({
          name: "",
          image: [],
          category: null,
          discount: "",
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

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section className=''>
          <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
            <button onClick={()=>{  close()}}>
              <IoClose size={20}/>
            </button>
          </div>
          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit} encType="multipart/form-data">
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
                  disabled={user.role === "Inventory Manager"} // Disable if role is 'Inventory Manager'
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
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
                  multiple
                  rows={3}
                  disabled={user.role === "Inventory Manager"} // Disable if role is 'Inventory Manager'
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                />
              </div>

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
                  disabled={user.role === "Inventory Manager"} // Disable if role is 'Inventory Manager'
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
              {user.role === "Admin" && (
              <>
                {/* Cover Image Section */}
                <div>
                  <p className='font-medium'>Cover Image</p>
                  <div>
                    <label htmlFor='CoverImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                      <div className='text-center flex justify-center items-center flex-col'>
                        {imageLoading ? <Loading /> : (
                          <>
                            <FaCloudUploadAlt size={35} />
                            <p>Upload Cover Image</p>
                          </>
                        )}
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
                    {/* Display uploaded cover image */}
                    <div className="flex flex-wrap gap-4">
                      {coverimaepreview ? (
                        <div key={coverimaepreview} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group">
                          <img
                            src={ coverimaepreview}
                            alt={`Preview`}
                            className="w-full h-full object-scale-down cursor-pointer"
                            onClick={() => setViewImageURL(coverimaepreview)}
                          />
                        </div>
                      ) : (
                        <p>No images to display</p> // Optional: You can customize this message
                      )}
                    </div>
                  </div>
                </div>

              {/* Product Images Section */}
              <div>
                <p className='font-medium'>Image</p>
                <div>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {imageLoading ? <Loading /> : (
                        <>
                          <FaCloudUploadAlt size={35} />
                          <p>Upload Image</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={imageRef}
                      type='file'
                      id='productImage'
                      multiple
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/* Display uploaded images */}
                  <div className='flex flex-wrap gap-4'>
                    {imagePreview && imagePreview.length !== 0 ? (
                      imagePreview.map((img, index) => {
                        return (
                          <div key={img + index} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group">
                            <img
                              src={img}
                              alt={img}
                              className="w-full h-full object-scale-down cursor-pointer"
                              onClick={() => setViewImageURL(img)}
                            />
                            <div
                              onClick={() => handleDeleteImage(index)}
                              className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                            >
                              <MdDelete />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No images to display</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
              <div className='grid gap-1'>
                <label className='font-medium'>Category</label>
                <div>
                <select
                  className="bg-blue-50 border w-full p-2 rounded"
                  value={data.category ? data.category._id : ""}
                  onChange={handleCategoryChange} // Call only handleCategoryChange
                >
                      {
                        allCategory.map((c,index)=>{
                          return(
                            <option value={c?._id} >
                              {c.name} 
                            </option>
                          )
                        })
                      }
                    </select>
                </div>
              </div>
      
               {/* Weight Variants Section */}
               <div>
                <p className='font-medium'>Weight Variants</p>
                {data.weightVariants.map((variant, index) => (
                  <div key={index} className="grid gap-2">
                    <input
                      type="text"
                      value={variant.weight}
                      placeholder="Enter weight"
                      onChange={(e) => handleWeightChange(index, 'weight', e.target.value)}
                      className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                    />

                    <input
                      type="number"
                      value={variant.price}
                      placeholder="Enter price"
                      onChange={(e) => handleWeightChange(index, 'price', e.target.value)}
                      className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                    />
                     <input
                        type='number'
                        name='qty'
                        placeholder='Quantity'
                        value={variant.qty}
                        onChange={(e) => handleWeightChange(index, 'qty', e.target.value)}
                        className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                      />
                    <button
                      type="button"
                      onClick={() => handleDeleteWeightVariant(index)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete Weight Variant
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddWeightVariant}
                  className="bg-primary-100 text-white py-2 rounded font-semibold"
                >
                  Add Weight Variant
                </button>
              </div>
              <div className='grid gap-1'>
                <label htmlFor='discount' className='font-medium'>Discount</label>
                <input
                  id='discount'
                  type='number'
                  placeholder='Enter product discount'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  required

                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              {/**add more field**/}
              {
                Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div className='grid gap-1'>
                      <label htmlFor={k} className='font-medium'>{k}</label>
                      <input
                        id={k}
                        type='text'
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value
                              }
                            }
                          })
                        }}
                        required
                        className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                      />
                    </div>
                  )
                })
              }

              <div onClick={() => setOpenAddField(true)} className=' hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                Add Fields
              </div>

              <button
                className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
              >
                Update Product
              </button>
            </form>
          </div>

          {
            ViewImageURL && (
              <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
            )
          }

          {
            openAddField && (
              <AddFieldComponent
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                submit={handleAddField}
                close={() => setOpenAddField(false)}
              />
            )
          }
        </section>
      </div>
    </section>
  )
}

export default EditProductAdmin

