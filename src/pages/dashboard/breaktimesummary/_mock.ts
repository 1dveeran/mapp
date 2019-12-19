import moment from 'moment';
import {AnalysisData, RadarData, VisitDataType} from './data.d';

// mock data
const visitData: VisitDataType[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

// const salesData = [];
// for (let i = 0; i < 12; i += 1) {
//   salesData.push({
//     x: `${i + 1}-users`,
//     y: Math.floor(Math.random() * 10) + 20,
//   });
// }

const salesData = [
  {
    x: 'Accounts',
    y: 12,
  },
  {
    x: 'Development',
    y: 16,
  },
  {
    x: 'Testing',
    y: 14,
  },
  {
    x: 'Implementation',
    y: 19,
  },
  {
    x: 'Security',
    y: 34,
  },
];

// const searchData = [];
// for (let i = 0; i < 50; i += 1) {
//   searchData.push({
//     index: i + 1,
//     keyword: `搜索关键词-${i}`,
//     count: Math.floor(Math.random() * 1000),
//     range: Math.floor(Math.random() * 100),
//     status: Math.floor((Math.random() * 10) % 2),
//   });
// }

const searchData = [
  {
    index: 1,
    keyword: 'Karthick Raja',
    count: 'Accounts',
    range: 12,
    status: Math.floor((Math.random() * 10) % 2),
  },
  {
    index: 2,
    keyword: 'Amal Raj',
    count: 'Testing',
    range: 14,
    status: Math.floor((Math.random() * 10) % 2),
  },
  {
    index: 3,
    keyword: 'Rajalakshmi',
    count: 'Testing',
    range: 13,
    status: Math.floor((Math.random() * 10) % 2),
  },
  {
    index: 4,
    keyword: 'David',
    count: 'Development',
    range: 10,
    status: Math.floor((Math.random() * 10) % 2),
  },
  {
    index: 5,
    keyword: 'Peter',
    count: 'Development',
    range: 24,
    status: Math.floor((Math.random() * 10) % 2),
  },
  {
    index: 6,
    keyword: 'Raguram',
    count: 'Accounts',
    range: 11,
    status: Math.floor((Math.random() * 10) % 2),
  }
];

const salesTypeData = [
  {
    x: 'Working Hours',
    y: 244,
  },
  {
    x: 'Break Hours',
    y: 68,
  },
];

const salesTypeDataOnline = [
  {
    x: 'Working Hours',
    y: 244,
  },
  {
    x: 'Break Hours',
    y: 321,
  },
];

const salesTypeDataOffline = [
  {
    x: 'Working Hours',
    y: 99,
  },
  {
    x: 'Break Hours',
    y: 188,
  },
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData: RadarData[] = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});

const getFakeChartData: AnalysisData = {
  visitData,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
};

export default {
  'GET  /api/fake_break_time_chart_data': getFakeChartData,
};
