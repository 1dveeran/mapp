import request from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('http://127.0.0.1:7000/api/get-patient', {
    method: 'GET',
    data: params,
  });
}

export async function queryRule() {
  return request('https://jsonplaceholder.typicode.com/posts/1');
}

export async function queryPatient(params: { patient_id: number }) {
  return request('http://127.0.0.1:7000/api/get-patient', {
    params,
  });
}

export async function updatePatientsInfo(params: any) {
  return request('http://127.0.0.1:7000/api/update-patient', {
    method: 'POST',
    data: params,
  });
}
