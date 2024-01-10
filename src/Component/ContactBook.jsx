import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './ContactBook.css';

const ContactBook = () => {
  const [users, setUsers] = useState([]);
  const [usersFilter, setUsersFilter] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    let user = await axios.get('http://localhost:4000/api/v1/user');
  
    let notNullArrayData = user?.data?.data?.map((userData) => {
      return ({
        ...userData, UserContactBooks: userData?.UserContactBooks?.map((contact_book) => {
          return ({
            id:contact_book?.id,
            email:contact_book?.email === null ? "" : contact_book?.email,
            phone_no:contact_book?.phone_no === null ? "" : contact_book?.phone_no
          })
        })
      })
    });

    setUsers(notNullArrayData);
    setUsersFilter(notNullArrayData);
  }

  const deleteUsers = async (user) => {
    await axios.delete('http://localhost:4000/api/v1/user', { data: { id: user.id } }).then(response => {
      if(response?.data?.meta?.message){
        toast(`${response?.data?.meta?.message}`);
        getUsers();
      }else if(response?.data?.code === 500){
        toast(`${response?.data?.message}`);
      }
    })
  }

  const redirect = () => {
    navigate('/user')
  }

  const userUpdate = (user) => {
    navigate('/user', { state: { userData: user, toggle: true } })
  }

  const searchFilter = (value) => {
    if (value) {
      let inputValue = value?.toLowerCase();
      let filter = users.filter(item => {
        // Check if the item name contains the search value
        if (item.name.toLowerCase().includes(inputValue)) {
          return true;
        }
        // Check if any of the UserContactBooks have matching email or phone_no
        const matchingContacts = item.UserContactBooks.filter(contact => {
          if (contact.email !== null || contact.phone_no !== null) {
            return contact.email.toLowerCase().includes(inputValue) || (contact.phone_no && contact.phone_no.toString().includes(inputValue));
          }
        });
        return matchingContacts.length > 0;
      });
      setUsersFilter(filter);
    } else if (value === "") {
      setUsersFilter(users);
    }
  }

  return (
    <div className="container mt-5">
      <div className='d-flex justify-content-between'>
        <button onClick={() => redirect()} className='btn btn-primary mx-2'>Add User</button>
        <input onChange={(e) => searchFilter(e.target.value)} placeholder='Search' className='border border-primary p-3' />
      </div>
      {usersFilter?.length > 0 ? 
      <table className="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone Number</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {usersFilter?.map((user, index) => {
          return (
            <tr key={index}>
              <td>{user.name}</td>
              <td className='d-flex flex-wrap' >{user.UserContactBooks?.map(email => email?.email !=="" && <span key={email?.id} className='capsule rounded-pill p-1 mx-1 my-1'>{email?.email}</span>)}</td>
              <td><div className='d-flex flex-wrap justify-conten-center'>{user.UserContactBooks?.map(phone_number => phone_number?.phone_no !=="" &&  <span key={phone_number?.id} className='capsule rounded-pill p-1 mx-1 my-1'>{phone_number?.phone_no}</span>)}</div></td>
              <td className=''>
                <button onClick={() => { deleteUsers(user) }} className='mx-2 btn btn-danger'>Delete</button>
                <button onClick={() => userUpdate(user)} className='btn btn-secondary'>Update</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table> : <h1 className='records d-flex justify-content-center align-items-center'>No records found</h1>}
      
    </div>
  );
};

export default ContactBook;