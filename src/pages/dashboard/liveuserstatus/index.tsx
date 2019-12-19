import {Card, Col, Dropdown, Icon, Menu, Row} from 'antd';
import React, {Component, Suspense} from 'react';

import {Dispatch} from 'redux';
import {GridContent} from '@ant-design/pro-layout';
import {RadioChangeEvent} from 'antd/es/radio';
import {RangePickerValue} from 'antd/es/date-picker/interface';
import {connect} from 'dva';
import {getTimeDistance} from './utils/utils';
import {AnalysisData} from './data.d';
import styles from './style.less';
import {FormattedMessage} from 'umi-plugin-locale';
import {Pie, TimelineChart, WaterWave} from './components/Charts';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

//Loading all the charts and data
const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface AnalysisProps {
  dashboardAnalysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface AnalysisState {
  salesType: 'all' | 'online' | 'stores';
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
}

@connect(
  ({
     dashboardAnalysis,
     loading,
   }: {
    dashboardAnalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAnalysis,
    loading: loading.effects['dashboardAnalysis/fetch'],
  }),
)
class Analysis extends Component<AnalysisProps, AnalysisState> {
  state: AnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const {dispatch} = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = (e: RadioChangeEvent) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
    const {dispatch} = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'dashboardAnalysis/fetchSalesData',
    });
  };

  selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
    const {dispatch} = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'dashboardAnalysis/fetchSalesData',
    });
  };

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const {rangePickerValue, salesType, currentTabKey} = this.state;
    const {dashboardAnalysis, loading} = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = dashboardAnalysis;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>Operation one</Menu.Item>
        <Menu.Item>Operation two</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis"/>
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    //Timeline CHart
    const chartData = [];
    for (let i = 0; i < 20; i += 1) {
      chartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 10) + 20,
        y2: Math.floor(Math.random() * 10) + 10,
        y3: Math.floor(Math.random() * 10) + 40,
      });
    }

    return (
      <GridContent>
        <React.Fragment>
          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card
                title={
                  <FormattedMessage
                    id="dashboard-monitor.monitor.activity-chart"
                    defaultMessage="Activity Chart"
                  />
                }
                style={{marginBottom: 24}}
                bordered={false}
              >
                <TimelineChart
                  height={300}
                  data={chartData}
                  titleMap={{y1: 'Active', y2: 'Idle', y3: 'InActive'}}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card
                title={
                  <FormattedMessage
                    id="dashboard-monitor.monitor.activity-table"
                    defaultMessage="Activity Table"
                  />
                }
                style={{marginBottom: 24}}
                bordered={false}
              >
                <ReactTable
                  data={[
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Suria Vikram',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2345,
                      system_name: 'IND-230049',
                      ip_address: '10.2.3.4',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Anandh Selvam',
                      user_name: 2098,
                      system_name: 'IND-230023',
                      ip_address: '10.2.3.33',
                      department: 'Accounts',
                      interval: '01:10 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Arun Kumar',
                      user_name: 2383,
                      system_name: 'IND-230834',
                      ip_address: '10.2.3.82',
                      department: 'Accounts',
                      interval: '11:00 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Jaikanth',
                      user_name: 2327,
                      system_name: 'IND-230040',
                      ip_address: '10.2.3.98',
                      department: 'Accounts',
                      interval: '21:45 Hrs',
                      status: 'Idle',
                    },
                    {
                      employee_name: 'Sundar',
                      user_name: 2334,
                      system_name: 'IND-340049',
                      ip_address: '10.2.3.56',
                      department: 'Accounts',
                      interval: '10:04 Hrs',
                      status: 'Disconnected',
                    },
                    {
                      employee_name: 'Subbiah',
                      user_name: 2345,
                      system_name: 'IND-222049',
                      ip_address: '10.2.4.4',
                      department: 'Accounts',
                      interval: '00:30 Hrs',
                      status: 'Connected',
                    },
                    {
                      employee_name: 'Karthick',
                      user_name: 2345,
                      system_name: 'IND-230044',
                      ip_address: '10.2.3.25',
                      department: 'Accounts',
                      interval: '01:20 Hrs',
                      status: 'Disconnected',
                    },
                  ]}
                  columns={[
                    {
                      Header: 'S.No',
                      id: 'row',
                      maxWidth: 50,
                      filterable: false,
                      Cell: row => {
                        return <div>{row.index + 1}</div>;
                      },
                    },
                    {
                      Header: 'Employee Name',
                      accessor: 'employee_name',
                    },
                    {
                      Header: 'Username',
                      accessor: 'user_name',
                    },
                    {
                      Header: 'System Name',
                      accessor: 'system_name',
                    },
                    {
                      Header: 'IP Address',
                      accessor: 'ip_address',
                    },
                    {
                      Header: 'Department',
                      accessor: 'department',
                    },
                    {
                      Header: 'Interval',
                      accessor: 'interval',
                    },
                    {
                      Header: 'Status',
                      accessor: 'status',
                      // getProps: (state, rowInfo, column, instance) => {
                      //   const rowValue = rowInfo.row.status ? rowInfo.row.status : 'Disconnected';
                      //   return {
                      //     style: {
                      //       background: rowValue != null && rowValue == 'Disconnected' ? '#ffcdd2' : rowValue == 'Idle' ? '#fff9c4' : '#c8e6c9',
                      //     },
                      //   };
                      // },
                    },
                  ]}
                  defaultPageSize={10}
                  pageSizeOptions={[10, 20]}
                  className="-striped -highlight"
                  minRows={1}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                {/*  <IntroduceRow loading={loading} visitData={visitData} /> */}
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>

          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          ></Row>

          <Suspense fallback={null}>
            {/* <SalesCard
              rangePickerValue={rangePickerValue}
              salesData={salesData}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
            /> */}
            <Row gutter={24}>
              <Col xl={12} lg={24} sm={24} xs={24} style={{marginBottom: 24}}>
                <Card
                  title={
                    <FormattedMessage
                      id="dashboard-monitor.monitor.proportion-per-category"
                      defaultMessage="Proportion Per Category"
                    />
                  }
                  bordered={false}
                  className={styles.pieCard}
                >
                  <Row style={{padding: '16px 0'}}>
                    <Col span={8}>
                      <Pie
                        animate={false}
                        percent={17}
                        subTitle={
                          <FormattedMessage
                            id="dashboard-monitor.monitor.active"
                            defaultMessage="Active"
                          />
                        }
                        total="17%"
                        height={128}
                        lineWidth={2}
                      />
                    </Col>
                    <Col span={8}>
                      <Pie
                        animate={false}
                        color="#5DDECF"
                        percent={29}
                        subTitle={
                          <FormattedMessage
                            id="dashboard-monitor.monitor.hibernate"
                            defaultMessage="Hibernate"
                          />
                        }
                        total="29%"
                        height={128}
                        lineWidth={2}
                      />
                    </Col>
                    <Col span={8}>
                      <Pie
                        animate={false}
                        color="#2FC25B"
                        percent={52}
                        subTitle={
                          <FormattedMessage
                            id="dashboard-monitor.monitor.inactive"
                            defaultMessage="InActive"
                          />
                        }
                        total="52%"
                        height={128}
                        lineWidth={2}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xl={12} lg={12} sm={24} xs={24} style={{marginBottom: 24}}>
                <Card
                  title={
                    <FormattedMessage
                      id="dashboard-monitor.monitor.resource-surplus"
                      defaultMessage="Resource Surplus"
                    />
                  }
                  bodyStyle={{textAlign: 'center', fontSize: 0}}
                  bordered={false}
                >
                  <WaterWave
                    height={161}
                    title={
                      <FormattedMessage
                        id="dashboard-monitor.monitor.utilization"
                        defaultMessage="Utilization"
                      />
                    }
                    percent={54}
                  />
                </Card>
              </Col>
            </Row>
          </Suspense>

          {/*           
            <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                /> 
                </Suspense>
                </Col>
                <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                  <Suspense fallback={null}>
                    <ProportionSales
                      dropdownGroup={dropdownGroup}
                      salesType={salesType}
                      loading={loading}
                      salesPieData={salesPieData}
                      handleChangeSalesType={this.handleChangeSalesType}
                    />
                  </Suspense>
                </Col>
              </Row>          
          */}

          {/*
            <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense> 
        */}
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
