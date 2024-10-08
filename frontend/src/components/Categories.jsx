import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table, Modal } from 'react-bootstrap';
import Header from './Header';

const Categories = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [subCategories, setSubCategories] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [validated, setValidated] = useState(false); // Add validation state

  const token = localStorage.getItem('token');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, [token]);

  // Event handlers
  const handleAddCategory = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true); // Set validated to true on submit

    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      const subCategoryArray = subCategories.split(',').map((sub) => sub.trim());
      const response = await axios.post(
        'http://localhost:5000/api/categories',
        {
          name: newCategory,
          subCategories: subCategoryArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories([...categories, response.data]);
      setNewCategory('');
      setSubCategories('');
    } catch (err) {
      console.error(err);
      alert('Failed to add category.');
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${selectedCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((category) => category._id !== selectedCategoryId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  const handleShowDeleteModal = (id) => {
    setSelectedCategoryId(id);
    setShowDeleteModal(true);
  };

  return (
    <Container>
      <Header />
      <Row className="mt-5">
        <Col>
          <h2>Categories</h2>
          {/* Category form */}
          <Form noValidate validated={validated} onSubmit={handleAddCategory}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formCategoryName" className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    isInvalid={validated && !newCategory} // Add validation
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a category name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formSubCategories" className="mb-3">
                  <Form.Label>Sub Categories</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subcategories"
                    value={subCategories}
                    required
                    onChange={(e) => setSubCategories(e.target.value)}
                    isInvalid={validated && !subCategories} // Add validation
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter at least one subcategory.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mb-3">
              Add Category
            </Button>
          </Form>

          {/* Categories table */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Subcategories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    {category.subCategories && category.subCategories.length > 0
                      ? category.subCategories.map((sub) => sub.name).join(', ')
                      : 'No Subcategories'}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleShowDeleteModal(category._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;
