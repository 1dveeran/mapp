import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_break_time_chart_data');
}
