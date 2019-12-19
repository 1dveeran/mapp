import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_live_user_status_chart_data');
}
