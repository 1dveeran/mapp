import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Radio,
  Result,
  Row,
  Select,
} from 'antd';
import React, {Component} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import moment from 'moment';
import {StateType} from './model';
import {IDiagnosisPatientInformation} from './data.d';
import styles from './style.less';
import Link from 'umi/link';
import router from 'umi/router';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {Search, TextArea} = Input;

interface DiagnosisPatientInfoProps extends FormComponentProps {
  listDiagnosisPatientInfo: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface DiagnosisPatientInfoState {
  visible: boolean;
  done: boolean;
  current?: Partial<IDiagnosisPatientInformation>;
}

@connect(
  ({
     listDiagnosisPatientInfo,
     loading,
   }: {
    listDiagnosisPatientInfo: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listDiagnosisPatientInfo,
    loading: loading.models.listDiagnosisPatientInfo,
  }),
)
class DiagnosisPatientInformation extends Component<DiagnosisPatientInfoProps,
  DiagnosisPatientInfoState> {
  state: DiagnosisPatientInfoState = {visible: false, done: false, current: undefined};

  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 13},
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'listDiagnosisPatientInfo/fetch',
      payload: {
        count: 5,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showAttendModal = (item: IDiagnosisPatientInformation) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  showAttendPage = (item: IDiagnosisPatientInformation) => {
    router.push(`/patients/add-patients/${item.id}`);
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {current} = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: IDiagnosisPatientInformation) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'listDiagnosisPatientInfo/submit',
        payload: {id, ...fieldsValue},
      });
    });
  };

  deleteItem = (id: string) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'listDiagnosisPatientInfo/submit',
      payload: {id},
    });
  };

  render() {
    const {
      listDiagnosisPatientInfo: {list},
      loading,
    } = this.props;
    const {
      form: {getFieldDecorator},
    } = this.props;

    const {visible, done, current = {}} = this.state;

    const attendAndDelete = (key: string, currentItem: IDiagnosisPatientInformation) => {
      if (key === 'attend') this.showAttendPage(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Delete Task',
          content: 'Are You Sure You Want To Delete This Task？',
          okText: 'confirm',
          cancelText: 'cancel',
          onOk: () => this.deleteItem(currentItem.id.toString()),
        });
      }
    };

    const modalFooter = done
      ? {footer: null, onCancel: this.handleDone}
      : {okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel};

    const Info: React.FC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({title, value, bordered}) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em/>}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">all</RadioButton>
          <RadioButton value="attended">attended</RadioButton>
          <RadioButton value="waiting">waiting</RadioButton>
          <RadioButton value="deferred">deferred</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="Please Enter" onSearch={() => ({})}/>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({
                           data: {joining_date, sex, age},
                         }: {
      data: IDiagnosisPatientInformation;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Sex</span>
          <p>{sex}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Joining Date</span>
          <p>{moment(joining_date).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          {/* <Progress percent={age} status={status} strokeWidth={6} style={{width: 180}}/> */}
          <span>Age</span>
          <p>{age}</p>
        </div>
      </div>
    );

    const MoreBtn: React.FC<{
      item: IDiagnosisPatientInformation;
    }> = ({item}) => (
      <Dropdown
        overlay={
          <Menu onClick={({key}) => attendAndDelete(key, item)}>
            <Menu.Item key="attend">Attend</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
          </Menu>
        }
      >
        <a>
          More <Icon type="down"/>
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            status="success"
            title="操作成功"
            subTitle="一系列的信息描述，很短同样也可以带标点。"
            extra={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="mission name" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{required: true, message: 'Please enter a task name'}],
              initialValue: current.first_name,
            })(<Input placeholder="please enter"/>)}
          </FormItem>
          <FormItem label="开始时间" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{required: true, message: '请选择开始时间'}],
              initialValue: current.joining_date ? moment(current.joining_date) : null,
            })(
              <DatePicker
                showTime
                placeholder="请选择"
                format="YYYY-MM-DD HH:mm:ss"
                style={{width: '100%'}}
              />,
            )}
          </FormItem>
          <FormItem label="任务负责人" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{required: true, message: '请选择任务负责人'}],
              initialValue: current.sex,
            })(
              <Select placeholder="请选择">
                <SelectOption value="付晓晓">付晓晓</SelectOption>
                <SelectOption value="周毛毛">周毛毛</SelectOption>
              </Select>,
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="产品描述">
            {getFieldDecorator('subDescription', {
              rules: [{message: '请输入至少五个字符的产品描述！', min: 5}],
              initialValue: current.chief_compliant,
            })(<TextArea rows={4} placeholder="请输入至少五个字符"/>)}
          </FormItem>
        </Form>
      );
    };
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="Attended" value="8 patients" bordered/>
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="Pending" value="32 patients" bordered/>
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="Deferred" value="3 patients"/>
                </Col>
              </Row>
            </Card>

            <Card
              className={styles.listCard}
              bordered={false}
              title="Patients List"
              style={{marginTop: 24}}
              bodyStyle={{padding: '0 32px 40px 32px'}}
              extra={extraContent}
            >
              {/*<Button*/}
              {/*  type="dashed"*/}
              {/*  style={{ width: '100%', marginBottom: 8 }}*/}
              {/*  icon="plus"*/}
              {/*  onClick={this.showModal}*/}
              {/*  ref={component => {*/}
              {/*    // eslint-disable-next-line  react/no-find-dom-node*/}
              {/*    this.addBtn = findDOMNode(component) as HTMLButtonElement;*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Add To*/}
              {/*</Button>*/}
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        key="attend"
                        onClick={e => {
                          e.preventDefault();
                          router.push(`/patients/add-patients/${item.id}`);
                          // <Link to="/patients/add-patients">go</Link>;
                        }}
                      >
                        attend
                      </a>,
                      <MoreBtn key="more" item={item}/>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape="square" size="large"/>}
                      title={<a href="http://localhost">{item.first_name}</a>}
                      description={item.chief_compliant}
                    />
                    <ListContent data={item}/>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `Task${current ? 'Compile' : 'Add to'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default Form.create<DiagnosisPatientInfoProps>()(DiagnosisPatientInformation);
