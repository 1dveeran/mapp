import request from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function queryRule() {
  return request('https://jsonplaceholder.typicode.com/posts/1');
}

export async function queryDiagnosis(params: { patient_id: number }) {
  return request('http://127.0.0.1:7000/api/get-diagnosis', {
    params,
  });
}

export async function updateDiagnosisInfo(params: any) {
  return request('http://127.0.0.1:7000/api/update-diagnosis', {
    method: 'POST',
    data: params,
  });
}
