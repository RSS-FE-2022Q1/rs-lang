import { API_ENDPOINT } from './constants';

import type { User } from './app-types';

// create User
export function registerUser (user: User) {
  return fetch(`${API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
}

// signin User
export function signInUser (user: User) {
  const url = `${API_ENDPOINT}/signin`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
}

// get User 
export async function getUser (userId:string, token:string){
  const rawResponse = await  fetch(`${API_ENDPOINT}/users/${userId}`, {
    method: 'GET',
    // withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  }).then(res=>{
    if(res.ok){
      return res.json();
    }
    let message = 'Some trouble while retrieving a user data';
    if(res.status === 401){
      message = 'Access token is missing or invalid';
    }
    if(res.status === 404){
      message = 'User not found';
    }
    throw new Error(message);
  }).then((data:User) => data).catch(err=>console.log(err));
  console.log('getUser', rawResponse);
  return rawResponse;
}

// update User
export async function updateUser (userId:string, token:string, user:User){
  let rawResponse;
  try{
    rawResponse = await fetch(`${API_ENDPOINT}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(user),
    }).then(res=>{
      if(res.ok){
        return res.json();
      }
      let message = 'Some trouble while updating the user';
      if(res.status === 400){
        message = 'Bad Request';
      }
      if(res.status === 401){
        message = 'Access token is missing or invalid';
      }
      throw new Error(message);
    }).then((data:User) => {
      console.log('User has been UPDATED');
      return data;
    });
  }catch(err){
    console.log(err);
  }
  console.log(rawResponse);

  return rawResponse;
}

// DELETE User 
export async function deleteUser (userId:string, token:string, userName:string){
  try{
    await fetch(`${API_ENDPOINT}/users/${userId}`, {
      method:'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }).then(res =>{
      console.log(`${res.status} - User ${userName} has been DELETED`);
    });
  }catch(err){
    console.log(err);
  }
}

// get New Tokens For the User 
export async function getNewTokensForTheUser (userId:string, refreshToken:string){
  let rawResponse;
  try{
    rawResponse = await fetch(`${API_ENDPOINT}/users/${userId}/tokens`,{
      method:'GET',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
      },
    }).then(res => {
      if(res.ok){
        console.log('Success in getting new tokens');
        return res.json();
      }
      let message = 'Something went wrong with getting a new tokens';
      if(res.status === 403){
        message = 'Access token is missing or invalid';
      }
      throw new Error(message);
    }).then((data:User) => data);
  } catch(err){
    console.log(err);
  };
  return rawResponse;
}
