import React, { useRef, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState(false)
  const [temp, settemp] = useState([])
  const [coverimaepreview, setCoverImagepreview] = useState(null)
  const [data, setData] = useState({
    name: "",
    image: [],
    category: 0,
    coverimage: null,
    discount: "",
    description: "",
    more_details: {}, 
    weightVariants: [],
    sku_code: "", // New field for weight variants
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  console.log(data);
  const file1 = useRef(null)


 // Handle adding weight variants (weight, price, qty)
 const handleAddWeightVariant = () => {
  const newWeightVariant = { weight: '', price: '', qty: '' };
  setData((prev) => ({
    ...prev,
    weightVariants: [...prev.weightVariants, newWeightVariant]
  }));
};

 // Handle change in weight variant fields
 const handleWeightVariantChange = (index, e) => {
  const { name, value } = e.target;
  const updatedWeightVariants = [...data.weightVariants];
  updatedWeightVariants[index][name] = value;
  setData((prev) => ({
    ...prev,
    weightVariants: updatedWeightVariants
  }));
};
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
  const handleUploadImage = async (e) => {
    console.log("handleUploadImage")
      
      const files =  file1.current.files;
    var allselectedfiles = [];
    Array.from(files).forEach((element) => {
    allselectedfiles.push(element);      
      
    });
    console.log(allselectedfiles);
    file1.current.value = "";
    
    
    
    
    const hasDuplicate = allselectedfiles.some((newFile) =>
      data.image.some(
        (existingFile) =>
          existingFile.name === newFile.name //  compare file name
      )
    );
    if(hasDuplicate){
      alert("Duplicate file selected")
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

  
  /// old for single image select at a time
  // const handleUploadImage = async (e) => {
  //   console.log(file1.current.value)
  //   // const files =  file1.current.files;
  //   // Array.from(files).forEach((element) => {
  //   //   console.log(element);
  //   // });
  //   const file = e.target.files[0];
  //   console.log("handleUploadImage")
  //   console.log(file);
  //   // Check if the file already exists by comparing the file name or lastModified timestamp
  //   const isFileExist = data.image.some((uploadedFile) => uploadedFile.name === file.name);
  //   if (isFileExist) {
  //     alert(`File  already exists. Please select a different file.`);
  //     e.target.value = "";  // Reset the file input so the user can select a new file
  //     return;  // Don't proceed further if the file already exists
  //   }

  //   const imageURL = URL.createObjectURL(file);
  //   console.log(imageURL);

  //   setImagePreview((prev) => [...prev, imageURL]);
  //   console.log(imagePreview)
  //   if (!file) {
  //     return
  //   }
  //   file1.current.value = "";



  //   setData((preve) => {
  //     return {
  //       ...preve,
  //       image: [...preve.image, file]
  //     }
  //   })
  //   // Reset the file input value
  //   setImageLoading(false)

  // }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSelectedCategory(false);
    setCoverImagepreview(null);  
    setImagePreview([]);

    console.log("-------");
    console.log(data.image)
    const formdata = new FormData();
    formdata.append("name", data.name)

    formdata.append("category", data.category)


    formdata.append("unit", data.unit)
    formdata.append("stock", data.stock)
    formdata.append("price", data.price)
    formdata.append("discount", data.discount)
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
        successAlert(responseData.message)
        setData({
          name: "",
          image: [],
          category: 0,
          coverimage: null,
          discount: "",
          description: "",
          more_details: {},
          weightVariants: [] ,// Reset weightVariants
          sku_code: "", // Reset sku_code
        })

      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className=''>
      <div className='p-2   bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-3'>
        <form className='grid gap-4' method='post' onSubmit={handleSubmit} encType='multipart/form-data'>
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
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div>
            <p className='font-medium'> 
              Cover
              Image
              
              </p>
            <div>
              <label htmlFor='CoverImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    imageLoading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Cover Image</p>
                      </>
                    )
                  }
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
              {/**display uploded image*/}
              <div className="flex flex-wrap gap-4">
               

                {/* Condition to check if imagePreview is not null or empty */}
                {coverimaepreview ? (
                  
                    // Display the image preview
                    <div
                      key={coverimaepreview}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                    >

                      <img
                        src={coverimaepreview}
                        alt={`Preview `}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(coverimaepreview)}
                      />
                      {/* <div
                        onClick={()=>{setCoverImagepreview(null)}}
                        className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div> */}
                    </div>
                  
                ) : (
                  <p>No images to display</p> // Optional: You can customize this message
                )}
              </div>

            </div>

          </div>



          <div>
            <p className='font-medium'>Image</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    imageLoading ? <Loading /> : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>
                    )
                  }
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
              {/**display uploded image*/}
              <div className="flex flex-wrap gap-4">
                {console.log(data.image)}

                {/* Condition to check if imagePreview is not null or empty */}
                {imagePreview && imagePreview.length > 0 ? (
                  imagePreview.map((image, index) => (
                    // Display the image preview
                    <div
                      key={image + index}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                    >

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
                  <p>No images to display</p> // Optional: You can customize this message
                )}
              </div>

            </div>

          </div>
          <div className='grid gap-1'>
            <label className='font-medium'>Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={data.category}
                onChange={(e) => {
                  const value = e.target.value
                  setData((preve) => {
                    return {
                      ...preve,
                      category: value,
                    }
                  })
                  setSelectedCategory(true)


                }}
              >
                {!selectedcategory && <option value={0}>
                  select category
                </option>
                }
                {
                  allCategory.map((c, index) => {
                    return (
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
              <div key={index} className='grid gap-2'>
                <input
                  type='text'
                  name='weight'
                  placeholder='Weight in Grms'
                  value={variant.weight}
                  onChange={(e) => handleWeightVariantChange(index, e)}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
                <input
                  type='number'
                  name='price'
                  placeholder='Price'
                  value={variant.price}
                  onChange={(e) => handleWeightVariantChange(index, e)}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
                <input
                  type='number'
                  name='qty'
                  placeholder='Quantity'
                  value={variant.qty}
                  onChange={(e) => handleWeightVariantChange(index, e)}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedVariants = data.weightVariants.filter((_, i) => i !== index);
                    setData((prev) => ({ ...prev, weightVariants: updatedVariants }));
                  }}
                  className='text-red-600'
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddWeightVariant} className='bg-primary-100 hover:bg-primary-200 py-1 rounded'>
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
            Submit
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
  )
}

export default UploadProduct