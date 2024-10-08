import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Header from './Header';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [validated, setValidated] = useState(false); // For form validation

  const token = localStorage.getItem('token');

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(productResponse.data);

        const categoryResponse = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoryResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductsAndCategories();
  }, [token]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true); // Set validated to true to trigger validation

    if (form.checkValidity() === false) {
      e.stopPropagation(); // Prevent form submission if invalid
    } else {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('category', newProduct.category);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      try {
        const response = await axios.post(
          'http://localhost:5000/api/products',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setProducts([...products, response.data]);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true); // Set validated to true to trigger validation

    if (form.checkValidity() === false) {
      e.stopPropagation(); // Prevent form submission if invalid
    } else {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('category', newProduct.category);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      try {
        const response = await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updatedProducts = products.map((product) =>
          product._id === editingProductId ? response.data : product
        );
        setProducts(updatedProducts);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category._id,
    });
    setSelectedImage(null);
    setValidated(false); // Reset validated state when editing
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred";
      alert("Error deleting product: " + errorMessage);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
    setSelectedImage(null);
    setEditingProductId(null);
    setValidated(false); // Reset validated state
  };

  return (
    <Container>
      <Header />
      <Row className="mt-5">
        <Col>
          <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
          <Form noValidate validated={validated} onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
            <Row>
              <Col xs={12} md={4}>
                <Form.Group controlId="formProductName" className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a product name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="formDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a product description.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="formPrice" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter product price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid product price.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="formCategory" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.parentCategory ? `${category.parentCategory.name} > ` : ''}{category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="formStock" className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter stock quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a stock quantity.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="formImageUpload" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="me-2">
              {editingProductId ? 'Update Product' : 'Add Product'}
            </Button>
            {editingProductId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h2>Product List</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditProduct(product)} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
