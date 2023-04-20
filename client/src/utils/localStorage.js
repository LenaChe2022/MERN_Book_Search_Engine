export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId) => {
//getItem('saved_books') - method to retrieve the value associated with the key "saved_books" from the localStorage object. 
//If there is a value associated with this key, localStorage.getItem('saved_books') will return the value as a string. 
//If there is no value associated with this key, localStorage.getItem('saved_books') will return null. 
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }
//filters an array and returns a new array with certain elements removed.  
//savedBookIds?. uses the optional chaining operator to check if savedBookIds is not null or undefined before accessing the filter() method on it. 
//If savedBookIds is not null or undefined, the filter() method is called on it to create a new array called updatedSavedBookIds. 
//The filter() method iterates over each element in savedBookIds and passes each element as an argument to the callback function:(savedBookId) => savedBookId !== bookId
//This callback function tests whether the current element (savedBookId) is not equal to bookId. 
//If the current element is not equal to bookId, the callback function returns true and the element is included in the new updatedSavedBookIds array. 
//If the current element is equal to bookId, the callback function returns false and the element is excluded from the new array.
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
