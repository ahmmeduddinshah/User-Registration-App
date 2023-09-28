import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ButtonGroup, Form, Row, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL = "https://complete-rest-api-node-express.onrender.com/api/users";

const Rootpage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({ username: "", email: "" });
  const [userId, setUserId] = useState(null);
  const [flag, setFlag] = useState(false);
  const { username, email } = user;

  const getUsers = async () => {
    try {
      const res = await axios.get(URL);
      setUsers(res.data.Users);
    } catch (err) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!flag) {
      axios.post(URL, user);
      setUser({ username: "", email: "" });
      toast("A New User has been Created Successfully.");
      getUsers();
    } else {
      axios.put(URL + `/${userId}`, user);
      toast("A Selected User has been Updated Successfully.");
      getUsers();
      setUser({ username: "", email: "" });
      setUserId(null);
      setFlag(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Would You Like to Delete?")) {
        await axios.delete(URL + `/${id}`);
        toast("A Selected User has been Deleted Successfully.");
      }
      getUsers();
    } catch (err) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    const signedUser = users.find((user) => user.id === id);
    setUser({ ...signedUser });
    setUserId(id);
    setFlag(true);
  };

  return (
    <>
      <ToastContainer />
      <h1 className="text-center">
        <u>User Registration</u>
      </h1>

      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}

      <Row xs={1} md={3} lg={4} className="d-flex justify-content-evenly m-3">
        <Form onSubmit={handleSubmit} className="text-center bg-warning p-3">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="username">User Name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={(e) =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              placeholder="Enter User Name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              placeholder="Enter Email"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {flag ? "Update User" : "Add User"}
          </Button>
        </Form>

        <Table striped bordered hover className="m-2 w-50">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, username, email }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>
                  <ButtonGroup>
                    <Button variant="info" onClick={() => handleEdit(id)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(id)}>
                      Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </>
  );
};

export default Rootpage;
