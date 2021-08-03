import React, {useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {DataTable} from 'primereact/datatable';

import {Column} from 'primereact/column';

import 'primeflex/primeflex.css';
import axios from 'axios';
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

let booklist=[];



export default function BooksPage() {


  const [list, setList] = useState(booklist );

  const [bookNameInput  , setBookNameInput] = useState('');
  const [authorNameInput, setAuthorNameInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    if (editingBook) {
      setBookNameInput(editingBook.book_name);
      setAuthorNameInput(editingBook.author_name);
      setSelectedCategory(editingBook.category);
    }
  }, [editingBook]);

  if (!list) return "No post !"

  async function getBooks() {
    const res = await axios.get("http://localhost:5000/books/books");
    /*  axios.get(baseURL+getUrl).then((response) => { // awaite cevirdik eski kod
          setList(response.data);
      });*/

    setList(res.data);
  }

  /*   async  function addBook(book)
     {
      //   console.log(book);
        // const response = await axios.post('http://localhost:5000/books/book', book);
       //  setList();
     }

   */

  const categories = [
    { label: 'Eğitim', value: 'EG' },
    { label: 'Hukuk', value: 'HKK' },
    { label: 'Siyaset', value: 'SY' },
    { label: 'Çocuk Kitapları', value: 'CCK' },
    { label: 'Edebiyat', value: 'ED' }
  ];

  //todo 1 ile  2  arasında ne fark var
  /* function  updateBookInput(rowData) { // function 1
       setBookNameInput(rawData.bookname);
  const editBook = (bookRow) => {  // function 2
    console.log(bookRow);
    //todo objeye cevirince->   setProduct({...product});
    setBookNameInput(bookRow.bookname);
  }
   }*/

  function resetInput() {
    setBookNameInput("");
    setAuthorNameInput("");
    setSelectedCategory('');
    setEditingBook('');
  }

  async function handleSaveButton() {
    const bookparam = { bookName : bookNameInput ,authorName: authorNameInput, category:selectedCategory };
    if (editingBook) {
      bookparam.id = editingBook.id;
    }
    const axiosFunc = editingBook ? axios.put : axios.post;

    try {
      await axiosFunc('http://localhost:5000/books/book', bookparam)
      getBooks();
      resetInput();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  async function handleDeleteButton(rowData) {
    try {
      await axios.delete(`http://localhost:5000/books/book`, {params: {id: rowData.id}});
      getBooks();
      resetInput();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  function handleCancelButton(){
    setEditingBook(null);
    resetInput();
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2"
                onClick={() => setEditingBook(rowData)}/>
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                onClick={() => handleDeleteButton(rowData)}
        />
      </React.Fragment>
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
              <label htmlFor="name1" className="p-col-fixed" >Book Name : </label>

            </div>
            <div className="p-col">
              <InputText value={bookNameInput}
                         onChange={e => setBookNameInput(e.target.value)}/>
            </div>
          </div>
          <div className="p-field p-grid">
            <div  className="p-col">
              <label htmlFor="name2" className="p-col-fixed">Author Name : </label>
            </div>
            <div className="p-col"  align="left">
              <InputText value={authorNameInput}
                         onChange={e => setAuthorNameInput(e.target.value)}/>
            </div>
          </div>
          <div className="p-field p-grid">
            <div  className="p-col" align="left">
              <label htmlFor="name1" className="p-col-fixed"> Category : </label>
            </div>
            <div className="p-col" align="left">
              <Dropdown style={{width: '250px'}}
                        value={selectedCategory}
                        options={categories}
                        onChange={(e) => {  setSelectedCategory(e.value); }}
              />
            </div>

          </div>

        </div>
      </div>
      <div>
        <div className="p-field p-grid">

              <span >
                    <Button label={editingBook ? 'Update' : 'Add'} onClick={ handleSaveButton} icon="pi pi-check" />
                    <Button label="Cancel" onClick={ handleCancelButton} icon="pi pi-check" />
                </span>
        </div>
      </div>
      <div>
        <h4>Library</h4>
        <DataTable value={list}>
          <Column field="book_name" header="Book Name"></Column>
          <Column field="author_name" header="Author Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

    </>
  );
}
