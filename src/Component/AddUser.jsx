import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { MultipleInputTags } from './CommonComponent/index'
import './AddUser.css';

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toggleAddEdit, setToggleAddEdit] = useState(false);
  const [name, setName] = useState("");
  const [emails, setEmails] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [emailsString, setEmailsString] = useState("");
  const [numbersString, setNumbersString] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (location.state !== null) {
      let emails = location?.state?.userData?.UserContactBooks?.map(email => email.email)?.filter((mail => mail !== ""));
      let phone_numbers = location?.state?.userData?.UserContactBooks?.map(phone => phone.phone_no)?.filter((num => num !== ""));

      setEmails(emails);
      setNumbers(phone_numbers);
      setName(location?.state?.userData?.name);
      setToggleAddEdit(location?.state?.toggle)
    }

  }, []);

  const handleKeyDownEmail = (e) => {
    setValid(false);
    if (e.key !== "Enter") return
    const value = e.target.value
    setEmailsString(value);
    if (!value.trim()) return

    var valid = true;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value == "" || !regex.test(value)) {
      valid = false;
    }

    if (valid === true) {
      setEmails([...emails, value]);
    }
    e.target.value = "";
  }

  const handleKeyDownNumber = (e) => {
    setValid(false);
    if (e.key !== "Enter") return
    const value = e.target.value
    if (!value.trim()) return

    var valid = true;
    var regex = /^[0-9]+$/;
    if (value == "" || !regex.test(value)) {
      valid = false;
    }

    if (valid === true) {
      setNumbers([...numbers, value]);
    }
    e.target.value = "";
  }

  const removeLastComma = (str) => {
    if (str.endsWith(",")) {
      return str.slice(0, -1);
    } else {
      return str;
    }
  }
 
  const addUser = () => {
    if ((name?.length > 0 && (emails?.length > 0 || emailsString?.length > 0)) && (numbers?.length > 0 || numbersString?.length > 0)) {
      try {
        let user = {
          name: name,
          emails: emails,
          numbers: numbers?.map(num => num?.toString())
        }
        if (toggleAddEdit) {
          user = {
            ...user,
            id: location?.state?.userData?.id
          }

          axios.put('http://localhost:4000/api/v1/user', user)
            .then(function (response) {
              if (response?.data?.meta?.code === 400) {
                toast(`${response?.data?.meta?.message}`);
              } else if (response?.data?.code === 400) {
                toast(`${response?.data?.message}`);
              } else if (response?.data?.code === 500) {
                toast(`${response?.data?.message}`);
              } else {
                toast(`${response?.data?.meta?.message}`);
                navigate('/')
              }
            });

        } else {
          axios.post('http://localhost:4000/api/v1/user', user)
            .then(function (response) {
              if (response?.data?.meta?.code === 400) {
                toast(`${response?.data?.meta?.message}`);
              } else if (response?.data?.code === 400) {
                toast(`${response?.data?.message}`);
              } else if (response?.data?.code === 500) {
                toast(`${response?.data?.message}`);
              } else {
                toast(`${response?.data?.meta?.message}`);
                navigate('/')
              }
            });
        }
      } catch (error) {
        toast("Internal Server Error.");
      }
    } else {
      // This logic will applied when don't hit enter for email and number
      if (emails?.length === 0) {
        let email = removeLastComma(emailsString);
        let emailArray = email?.split(",");
        setEmails(emailArray);
      } if (numbers?.length === 0) {
        let number = removeLastComma(numbersString);
        let numberArray = number?.split(",");
        setNumbers(numberArray);
      }
      setValid(true);
    }
  }

  return (
    <div>
      <div className='center'>
        <button onClick={() => navigate('/')}>Back</button>
        {valid && <p className='text-center important'>All Fields are required.</p>}
        <h1 className='text-center'>{toggleAddEdit ? "Edit User " : "Add User"}</h1>
        <div className='p-3'>
          <span className='mx-2'>Name</span>
          <input name='name' value={name || ""} onChange={(e) => {
            setName(e.target.value);
            setValid(false);
          }} />
        </div>
        <div className='p-3'>
          <span>Email</span>
          <p className='important'>{`**click enter after type the email for multiple input`}</p>
          <MultipleInputTags
            handleKeyDown={(e) => handleKeyDownEmail(e)}
            onChange={(e) => setEmailsString(e.target.value)}
            removeTagFlag={false}
            setTags={setEmails}
            tags={emails}
          />
        </div>
        <div className='p-3'>
          <span>Phone Number</span>
          <p className='important'>{`**click enter after type the phone number for multiple input`}</p>
          <MultipleInputTags
            handleKeyDown={(e) => handleKeyDownNumber(e)}
            onChange={(e) => setNumbersString(e.target.value)}
            removeTagFlag={false}
            setTags={setNumbers}
            tags={numbers}
          />
        </div>
        <div className='d-flex justify-content-center p-2 '>
          <button onClick={() => { addUser() }} className='btn btn-primary'>{toggleAddEdit ? "Edit" : "Add"}</button>
        </div>

      </div>
    </div>

  );
};

export default AddUser;