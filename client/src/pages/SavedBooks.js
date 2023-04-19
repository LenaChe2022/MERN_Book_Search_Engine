import React, { useState } from 'react';
//import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
//EC:
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';


//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;


  //EC: here "loading" - what let us know if the data is avaliable or not
  // and "data" - that contain the results of making that query
  const { loading, data } = useQuery(GET_ME);
   //EC: if my "data" is avaliable, so I use it, otherwise it's gona be just empty array. 
  setUserData(data.me);
   console.log(userData);
  //EC: Here I use "loading " to check: if this "loading" is true (i do not have data yet), so I display this message <div>Loading...</div>
  //otherwise ( : ) if my data is liaded I can go ahead and pass that to my ProfileList as a property {profiles}

  //EC: Remove this useEffect:
   // useEffect(() => {
   //   const getUserData = async () => {
   //     try {
   //       const token = Auth.loggedIn() ? Auth.getToken() : null;

   //       if (!token) {
   //         return false;
   //       }

   //       const response = await getMe(token);

   //       if (!response.ok) {
   //         throw new Error('something went wrong!');
   //       }

   //       const user = await response.json();
   //       setUserData(user);
   //     } catch (err) {
   //       console.error(err);
   //     }
   //   };


   //   getUserData();
    // }, [userDataLength]);

   //EC: add REMOVE_BOOK functionality
   const [removeBook, { error }] = useMutation(REMOVE_BOOK);
//EC: With cache:
    // const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    //   update(cache, { data: { saveBookGql } }) {
    //   try {
    //    // update me object's cache    
    //     const { me } = cache.readQuery({ query: GET_ME });
    //     cache.writeQuery({
    //       query: GET_ME,
    //       data: { me: { ...me, savedBooks: [...me.savedBooks, saveBookGql] } },
    //     });
    //    } catch (error) {
    //     console.error(error);
    //    }
    //   },
    //   });




    // create function that accepts the book's mongo _id value as param and deletes the book from the database
   const handleDeleteBook = async (bookId) => {

    const token = Auth.loggedIn() ? Auth.getToken() : null;

     if (!token) {
       return false;
     }

     //EC: add my code dor remove book  
     try {
      const { data } = await removeBook({
        variables: {bookId},
      });

      removeBookId(bookId);;
      } catch (error) {
      console.error(error);
      }
    };
  

    //EC: need to change it to mutation (above)  
    // try {
    //   const response = await deleteBook(bookId, token);

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    //   const updatedUser = await response.json();
    //   setUserData(updatedUser);
    //   // upon success, remove book's id from localStorage
    //   removeBookId(bookId);
    // } catch (err) {
    //   console.error(err);
    // }
  //};

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
