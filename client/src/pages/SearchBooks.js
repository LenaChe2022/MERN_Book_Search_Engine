import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
//EC: will not use saveBook
import { searchGoogleBooks } from '../utils/API';
//import { saveBook, searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

//EC: Import the `useMutation()` hook from Apollo Client
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';

//EC: Import the GraphQL mutation
import { SAVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

import { useParams } from 'react-router-dom';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  //EC: this show "undefined"
  // const { userId } = useParams();
  // const { loading, myId } = useQuery(GET_ME, {
  //   variables: { userId: userId },
  // });

  // const user = myId;
  // console.log(user);

  //EC: Invoke `useMutation()` hook to return a Promise-based function and data about the SAVE_BOOK mutation
  //EC: this function 'saveBookGql' is just a wrapper for useMutation
  const [saveBookGql, { error }] = useMutation(SAVE_BOOK);

//     update(cache, { data: { savedBooks } }) {
//       try {
//     // update me object's cache    
//         const { me } = cache.readQuery({ query: GET_ME });
//         cache.writeQuery({
//           query: GET_ME,
//           data: { me: { ...me, savedBooks: [...me.savedBooks, saveBookGql] } },
//         });
//        // console.log(me);
//       } catch (error) {
//         console.error(error);
//       }
//     },
//  });

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || '',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      
      //To test:
      console.log(bookData);

      //EC: bookData - an array of books from googlesearch which shoun on the page
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    //To test:
    console.log(bookToSave);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    //To test!
    console.log (token);
    if (!token) {
      return false;
    }
//TODO: execute SAVE_BOOK mutation. With try... catch block. -OK. ??-token
//EC: code for gql mutation
    try {
      const {data} = await saveBookGql({
        variables: {
           ...bookToSave
           //author, 
          // description,
          // title, 
          // bookId, 
          // image, 
          // link
        }
      });
     console.log(data);
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.log("handleSaveBook:");
      console.error(err);
    }
  };

//EC: previous code:
    // try {
    //   const response = await saveBook(bookToSave, token);

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    //   // if book successfully saves to user's account, save book id to state
    //   setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    // } catch (err) {
    //   console.error(err);
    // }
  //};

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;


