import React, {useEffect, useState} from 'react';
import { map } from 'lodash';
import './UsersManager.scss';
import {Modal, Button, Input} from 'semantic-ui-react';

export default function UsersManager(props) {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    return fetch('/api/auth/users')
      .then(response => response.json())
      .then(data => {
        if (data.success === 1) {
          setUsers(data.data);
        }
      });
  }

  function addUser(username, password) {
    fetch('/api/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: username, password: password}),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.success === 1) {
        getUsers();
      }
    });
  }

  function deleteUser(username) {
    fetch('/api/auth/user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: username}),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === 1) {
        getUsers();
      }
    });
  }

  return (
    <Modal
      onClose={() => props.toggleUsersManager(false)}
      onOpen={() => props.toggleUsersManager(true)}
      open={props.showUsersManager}
    >
      <Modal.Header>Manage Users</Modal.Header>
      <Modal.Content >
        <Modal.Description>
          { map(users, (user) => (
              <div className='users-manager-user'>
                <p className='users-manager-username'>{user}</p>
                <Button color='red' onClick={() => deleteUser(user)}>Delete</Button>
              </div>
            ))
          }
          <div className='users-manager-add-user'>
            <div className='users-manager-add-user-fields'>
              <Input placeholder='Username' onChange={(e) => setNewUsername(e.target.value)}/>
              <Input placeholder='Password' onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button color='blue' onClick={() => addUser(newUsername, newPassword)}>Add</Button>
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => props.toggleUsersManager(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}