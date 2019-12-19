import request from '@/utils/request';
import {FormDataType} from './index';
import axios from 'axios';

export async function fakeAccountLogin(params: FormDataType) {
  console.log('passing paramenters for login');
  console.log(params);


  // fetch('https://jsonplaceholder.typicode.com/posts')
  //   .then(response => response.json())
  //   .then(data => console.log('Fetched Data: ', data))

  axios.get('https://jsonplaceholder.typicode.com/posts')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });


  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
