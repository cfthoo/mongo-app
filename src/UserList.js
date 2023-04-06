import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function deleteUser(id) {
  fetch(`http://localhost:8080/users/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log(response);
      //fetchUsers();
    })
    .catch((error) => {
      // printing error...
      console.log(error);
    });
}



function UserList() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8080/users/all');
    const data = await response.json();
    setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    
    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }),
    })
      .then((response) =>  {
       // console.log(data); // Add this line
              // Add the new user to the state
   
   
      fetchUsers();
      })
      .catch((error) => {
        // Handle errors
        console.log(error);
      });

    // Reset form values
    setUsername('');
    setEmail('');
  };


  const columns = [
    {
      name:"username",
      selector: row=>row.username,
      sortable: true
    },
    {
      name:"email",
      selector: row=>row.email,
      sortable: true
    },
    {
      name:"id",
      selector: row=>row.id
      //sortable: true
    },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => handleDeleteClicked(row)}>Delete</button>
      )
    }
  ];

  const filteredColumns = columns.filter((column) => column.name !== "id");

  const handleRowClicked = (row) => {
    console.log(row.id);
    // handle the id value here
  };

  const handleDeleteClicked = (row) => {
    const confirmed = window.confirm(`Are you sure you want to delete user ${row.id}?`);
    if (confirmed) {
      deleteUser(row.id);
    }
  };

  return (
    
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button type="submit">Create User</button>
      </form>
      <DataTable
        columns={filteredColumns}
        data={users}
        selectableRows
        fixedHeader
        pagination
        onRowClicked={handleRowClicked}
               contextActions={
        <button onClick={handleDeleteClicked}>Delete</button>
          }
      ></DataTable>
    {/* <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table> */}
    </div>
  );
}

export default UserList;
