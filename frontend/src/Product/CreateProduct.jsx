import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productImagePreview, setProductImagePreview] = useState("");

  const changePhotoHandler = (e) => {
    console.log(e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProductImagePreview(reader.result);
      setProductImage(file);
    };
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("productImage", productImage);

    try {
      const { data } = await axios.post(
        "http://localhost:3900/api/products/create/new",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      toast.success(data.message || "Product Created successfully");
      setTitle("");
      setCategory("")
      setDescription("");
      setPrice("");
      setProductImage("");
      setProductImagePreview('');
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Please fill the required fields");
    }

  }




  return (
    <div>
      <div className="min-h-screen  py-10">
        <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-8">Create product</h1>
          <form action="" onSubmit={handleCreateProduct} className="space-y-6">
            <div className="space-y-2">
            <label className="block text-lg">Title</label>
              <input type="text"
              value={title}
              placeholder='Enter Your Product Title'
              onChange={(e) => setTitle(e.target.value)} />
            </div >
            <div className="space-y-2">
              <label className="block text-lg">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Footwear">Footwear</option>
                <option value="Beauty">Beauty</option>
                <option value="Accessories">Accessories</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div className="space-y-2">
            <label className="block text-lg">Description</label>
              <input type="text"
              value={description}
              placeholder='Enter Your Product Description'
              onChange={(e) => setDescription(e.target.value)} />
            </div >
            <div className="space-y-2">
            <label className="block text-lg">Price</label>
              <input type="number"
              value={price}
              placeholder='Enter Your Product Price'
              onChange={(e) => setPrice(e.target.value)} />
            </div >
            <div className="space-y-2">
            <label className="block text-lg">Stock</label>
              <input type="text"
              value={stock}
              placeholder='Enter Your Product Stock'
              onChange={(e) => setStock(e.target.value)} />
            </div >
            <div className="space-y-2">
              <label className="block text-lg">Product Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={productImagePreview ? `${productImagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Product
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct