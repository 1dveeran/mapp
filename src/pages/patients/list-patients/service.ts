import request from '@/utils/request';
// import {TableListParams} from './data.d';

// export async function queryRule(params: TableListParams) {
//   return request('/api/rule', {
//     params,
//   });
// }

export async function queryRule() {
  return request('http://localhost:3000/data_table');
}

export async function queryPatientsList() {
  const getData = request('http://localhost:7000/api/get-all-patients');
  console.log("POST Req: ", getData);
  return getData;
}

// export async function removeRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

// export async function addRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'post',
//     },
//   });
// }

// export async function updateRule(params: TableListParams) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'update',
//     },
//   });
// }
