import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false); // State for form validation
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/categories');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username,
          password,
        });
        localStorage.setItem('token', response.data.token);
        navigate('/categories');
        window.location.reload();
      } catch (err) {
        setError('Invalid username or password');
      }
    }
    setValidated(true); // Update validation state
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          <Form noValidate validated={validated} onSubmit={handleLogin}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(''); // Clear error on input change
                }}
                required
                isInvalid={validated && !username} // Show invalid state
              />
              <Form.Control.Feedback type="invalid">
                Please enter your username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error on input change
                }}
                required
                isInvalid={validated && !password} // Show invalid state
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </Form>

          <div className="mt-3 text-center">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
