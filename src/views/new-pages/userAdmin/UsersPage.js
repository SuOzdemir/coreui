

import React, { useState ,useEffect} from 'react';
//import { ResetPasswordDialog } from './components/ResetPasswordDialog';
import { InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Password } from 'primereact/password';
import { Column } from 'primereact/column';
import {Dialog} from "primereact/dialog";
//import './PasswordDemo.css';
import 'primeflex/primeflex.css';

import axios from 'axios';


export default function UsersPage() {

  //todo keyfilter={/^[^#<>*!]+$/}

  const [list, setList] = useState([] );

  const [userNameInput  , setUserNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetUser, setResetUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);


  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setUserNameInput(editingUser.name);
      setEmailInput(editingUser.email);
      setPasswordInput(editingUser.password);

    }
  }, [editingUser]);

  async function getUsers() {
    const res = await axios.get("http://localhost:5000/users/users");
    setList(res.data);
  }


  function resetInput() {
    setUserNameInput("");
    setEmailInput("");
    setPasswordInput('');
    setEditingUser(null);

  }

  async function handleSaveButton() {
    const userparam = { name : userNameInput ,email: emailInput, password:passwordInput };
    if (editingUser) {
      userparam.id = editingUser.id;
    }
    const axiosFunc = editingUser ? axios.put : axios.post;

    try {
      await axiosFunc('http://localhost:5000/users/user', userparam)
      getUsers();
      resetInput();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  async function handleDeleteButton(rowData) {
    try {
      await axios.delete(`http://localhost:5000/users/user`, {params: {id: rowData.id}});
      getUsers();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  function handleCancelButton(){
    resetInput();
  }

  const onHide = () => {
    setResetUser(null);
  }

  async function handleResetButton(){

    const userparam = { password:resetPasswordInput };

    if (resetUser) {
      userparam.id = resetUser.id;
    }
    try {
      await axios.put('http://localhost:5000/users/resetPassword', userparam)
      //  getUsers();
      setResetPasswordInput('');
      setResetUser(null);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }


  const renderFooter = () => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
        <Button label="Yes" icon="pi pi-check" onClick={() => handleResetButton()} autoFocus />
      </div>
    );
  }
  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                onClick={() => setEditingUser(rowData)}/>
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                onClick={() => handleDeleteButton(rowData)}  />

        <Button label="Reset Password" icon="pi pi-external-link" onClick={() => setResetUser(rowData)} />

      </div>
    );
  }
  //  onClick={() => confirmDeleteProduct(rowData)} />
  //     onClick={() => editProduct(rowData)} />

  return (
    <>
      <div>
        <div className="w3-panel w3-red">

          <div className="p-field p-grid">
            <div className="p-col">
              <label htmlFor="name1" className="p-col-fixed" >User Name : </label>

            </div>
            <div className="p-col">
              <InputText value={userNameInput}
                         onChange={e => setUserNameInput(e.target.value)}/>
            </div>
          </div>
          <div className="p-field p-grid">
            <div  className="p-col">
              <label htmlFor="name2" className="p-col-fixed">Email : </label>
            </div>
            <div className="p-col"  align="left">
              <InputText value={emailInput}
                         onChange={e => setEmailInput(e.target.value)}/>
            </div>
          </div>

          <div className="p-field p-grid">
            <div  className="p-col" align="left">
              <label htmlFor="name1" className="p-col-fixed"> Password : </label>
            </div>
            <div className="p-col" align="left">
              <Password  style={{width: '250px'}}
                         value={passwordInput}
                         onChange={(e) => {  setPasswordInput(e.target.value) }}
                         toggleMask  />
            </div>

          </div>

        </div>
      </div>
      <div>
        <div className="p-field p-grid">

              <span >
                    <Button label={editingUser ? 'Update' : 'Add'} onClick={ handleSaveButton} icon="pi pi-check" />
                    <Button label="Cancel" onClick={ handleCancelButton} icon="pi pi-check" />

                </span>
        </div>
      </div>
      <div>
        <h4>Library</h4>
        <DataTable value={list}>
          <Column field="name" header="User Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
      <Dialog header="Reset Password" visible={!!resetUser} style={{ width: '50vw' }}
              footer={renderFooter()} onHide={() => onHide()}>

        <div className="p-field p-grid">
          <div  className="p-col" align="left">
            <label htmlFor="name1" className="p-col-fixed"> Password : </label>
          </div>
          <div className="p-col" align="left">
            <Password  style={{width: '250px'}}  value={resetPasswordInput}
                       onChange={(e) => {  setResetPasswordInput(e.target.value) }}
                       toggleMask  />
          </div>

        </div>

      </Dialog>
    </>
  );

}
