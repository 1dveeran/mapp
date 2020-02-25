import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  message,
  Row,
  Select,
} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import moment from 'moment';
import {StandardTableColumnProps} from './components/StandardTable';
import UpdateForm, {FormValsType} from './components/UpdateForm';
import {IPatientList} from './data';

import styles from './style.less';
//Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import router from 'umi/router';

const FormItem = Form.Item;
const {Option} = Select;

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface PatientListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  patientListInfo: IPatientList;
}

// interface TableListState {
//   modalVisible: boolean;
//   updateModalVisible: boolean;
//   expandForm: boolean;
//   selectedRows: ITableListItem[];
//   formValues: { [key: string]: string };
//   stepFormValues: Partial<ITableListItem>;
// }

/* eslint react/no-multi-comp:0 */
// @connect(
//   ({
//      listTableList,
//      loading,
//    }: {
//     listTableList: TableListItem;
//     loading: {
//       models: {
//         [key: string]: boolean;
//       };
//     };
//   }) => ({
//     listTableList,
//     loading: loading.models.rule,
//   }),
// )
@connect(
  ({
     loading,
     patientList,
   }: {
    loading: { effects: { [key: string]: boolean } };
    patientList: { patientListInfo: IPatientList };
  }) => ({
    submitting: loading.effects['patientList/savePatientList'],
    patientListInfo: patientList.patientListInfo,
  }))
class PatientListInfo extends Component<PatientListProps> {
  state = {
    width: '100%',
    disabledSmoking: true,
    disabledPregnancyDueDate: true,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'patientList/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listTableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listTableList/remove',
          payload: {
            //key: selectedRows.map(row => row.key),
            key: selectedRows.map(row => row.name),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: ITableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'listTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleNewButtonClick = () => {
    router.push(`/patients/add-patients`);
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
    },
    {
      title: 'Phone Number',
      dataIndex: 'callNo',
      sorter: true,
      align: 'right',
      render: (val: string) => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: '0',
        },
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
      ],
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: 'Updated Ad',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: 'Operation',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>Configuration</a>
          <Divider type="vertical"/>
          <a href="">Subscribe to alerts</a>
        </Fragment>
      ),
    },
  ];

  handleAdd = (fields: { desc: any }) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'listTableList/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('Added successfully');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'listTableList/update',
      payload: {
        name: fields.name,
        // desc: fields.desc,
        // key: fields.key,
      },
    });

    message.success('The configuration was successfully added successfully.');
    this.handleUpdateModalVisible();
  };

  onRowClick = (state: any, rowInfo: any, column: any, instance: any) => {
    return {
      onClick: (e: any) => {
        console.log('A Td Element was clicked!')
        console.log('it produced this event:', e)
        console.log('It was in this column:', column)
        console.log('It was in this row:', rowInfo)
        console.log('It was in this table instance:', instance)
      }
    }
  }

  handleEdit = (value: any) => {
    console.log(value.name);
  }

  filterCaseInsensitive(filter: any, row: any, column: any) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
        true
    );
  }

  renderSimpleForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Rule name">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status of use">
              {getFieldDecorator('status')(
                <Select placeholder="please choose" style={{width: '100%'}}>
                  <Option value="0">shut down</Option>
                  <Option value="1">Running</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Rule name">
              {getFieldDecorator('name')(<Input placeholder="please enter"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status of use">
              {getFieldDecorator('status')(
                <Select placeholder="please choose" style={{width: '100%'}}>
                  <Option value="0">shut down</Option>
                  <Option value="1">Running</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      patientListInfo,
      loading,
    } = this.props;    

    const { width } = this.state;
    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    // const filterCaseInsensitive1 = ({ id, value }, row: any) =>
    // row[id] ? String(row[id].toLowerCase().includes(value.toLowerCase())) : true

    if(Object.entries(patientListInfo).length === 0) {
      console.log("React Table: No data");
      return null;
    } else {
      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleNewButtonClick()}>
                  New
                </Button>
              </div>
              <div>
                <ReactTable
                  data={patientListInfo} // Use data={[patientListInfo]} if response is not array type
                  columns={[{
                    Header: 'First Name',
                    accessor: 'first_name',
                  }, {
                    Header: 'Last Name',
                    accessor: 'last_name',
                  },
                    {
                      Header: '',
                      Cell: row => (
                        <div>
                          <button onClick={() => this.handleEdit(row.original)}>Edit</button>
                        </div>
                      )
                    }
                  ]}
                  //getTrProps={this.onRowClick}
                  filterable
                  defaultFilterMethod={(filter, row, column) => this.filterCaseInsensitive(filter, row, column)}
                  //defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
                  //defaultFilterMethod={filterCaseInsensitive1}
                  defaultPageSize={3}
                  pageSizeOptions={[3, 6]}
                />
              </div>
            </div>
          </Card>          
        </PageHeaderWrapper>
      );
    }    
  }
}

export default Form.create<PatientListProps>()(PatientListInfo);
