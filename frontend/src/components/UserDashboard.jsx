import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Dropdown, Button } from 'react-bootstrap';
import Header from './Header';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // New state for selected category

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts with fetched products
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories'); // Adjust the endpoint if needed
        setCategories(response.data); // Set fetched categories
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleSortAZ = () => {
    const sorted = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredProducts(sorted);
  };

  const handleSortZA = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
    setFilteredProducts(sorted);
  };

  const handleSortPriceLowToHigh = () => {
    const sorted = [...filteredProducts].sort((a, b) => a.price - b.price);
    setFilteredProducts(sorted);
  };

  const handleSortPriceHighToLow = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
    setFilteredProducts(sorted);
  };

  const filterByPriceRange = (min, max) => {
    const filtered = products.filter(product => product.price >= min && product.price <= max);
    setFilteredProducts(filtered);
  };

  const filterByCategory = (categoryId) => {
    const filtered = products.filter(product => product.category && product.category._id === categoryId);
    setFilteredProducts(filtered);
    setSelectedCategory(categoryId); 
  };

  const resetFilters = () => {
    setFilteredProducts(products);
    setSelectedCategory(null); 
  };

  return (
    <Container>
      <Header />
      {/* Dynamic Categories Section */}
      <h5 className="mt-4">Categories</h5>
      <div className="d-flex flex-wrap mb-2">
        {categories.map((category) => (
          <Button 
            key={category._id} 
            variant={selectedCategory === category._id ? "primary" : "outline-secondary"} 
            className="m-1" 
            onClick={() => filterByCategory(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <Row className="mt-5">
        <Col md={3} className="d-flex flex-column mb-4">
          <h5>Price Filters</h5>
          <Button variant="outline-primary" onClick={() => filterByPriceRange(0, 100)}>
            $0 - $100
          </Button>
          <Button variant="outline-primary" className="mt-2" onClick={() => filterByPriceRange(100, 500)}>
            $100 - $500
          </Button>
          <Button variant="outline-primary" className="mt-2" onClick={() => filterByPriceRange(501, 1000)}>
            $501 - $1000
          </Button>
          <Button variant="outline-primary" className="mt-2" onClick={() => filterByPriceRange(1001, 2000)}>
            $1001 - $2000
          </Button>
          <Button variant="outline-secondary" className="mt-2" onClick={resetFilters}>
            Show All
          </Button>
        </Col>
        <Col md={9}>
          <h2>Products</h2>
          <div className="mb-3 d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Sort Options
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleSortAZ}>Sort A-Z</Dropdown.Item>
                <Dropdown.Item onClick={handleSortZA}>Sort Z-A</Dropdown.Item>
                <Dropdown.Item onClick={handleSortPriceLowToHigh}>Sort Price Low to High</Dropdown.Item>
                <Dropdown.Item onClick={handleSortPriceHighToLow}>Sort Price High to Low</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Row>
            {filteredProducts.map((product) => (
              <Col md={4} key={product._id} className="mb-4">
                <Card>
                  <Card.Img 
                    variant="top" 
                    src={product.imageUrl ? `http://localhost:5000/${product.imageUrl}` : 'placeholder_image_url_here'} 
                    alt={product.name} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      <strong>Price:</strong> ${product.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
