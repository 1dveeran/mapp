import {Button, Card, Col, DatePicker, Form, Icon, Input, Popover, Row, Select, TimePicker,} from 'antd';
import React, {Component} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const {Option} = Select;
const {RangePicker} = DatePicker;

const fieldLabels = {
  name: 'Warehouse name',
  url: 'Warehouse domain',
  owner: 'Warehouse Manager',
  approver: 'Approver',
  dateRange: 'effective date',
  type: 'Warehouse type',
  name2: 'Task name',
  url2: 'mission details',
  owner2: 'Executive',
  approver2: 'Responsible',
  dateRange2: 'effective date',
  type2: 'Task type',
};

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

interface AdvancedFormProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({loading}: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['formAdvancedForm/submitAdvancedForm'],
}))
class AdvancedForm extends Component<AdvancedFormProps> {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: {getFieldsError},
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon}/>
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="Form verification information"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle"/>
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const {width: stateWidth} = this.state;
        if (stateWidth !== width) {
          this.setState({width});
        }
      }
    });
  };

  validate = () => {
    const {
      form: {validateFieldsAndScroll},
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'formAdvancedForm/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
      submitting,
    } = this.props;
    const {width} = this.state;
    return (
      <>
        <PageHeaderWrapper
          content="Advanced forms are common in scenarios where one-time input and submission of large amounts of data.">
          <Card title="Warehouse management" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{required: true, message: 'Please enter the name of the warehouse'}],
                    })(<Input placeholder="Please enter the name of the warehouse"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.url}>
                    {getFieldDecorator('url', {
                      rules: [{required: true, message: 'please choose'}],
                    })(
                      <Input
                        style={{width: '100%'}}
                        addonBefore="http://"
                        addonAfter=".com"
                        placeholder="please enter"
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.owner}>
                    {getFieldDecorator('owner', {
                      rules: [{required: true, message: 'Please select an administrator'}],
                    })(
                      <Select placeholder="Please select an administrator">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.approver}>
                    {getFieldDecorator('approver', {
                      rules: [{required: true, message: 'Please select an approver'}],
                    })(
                      <Select placeholder="Please select an approver">
                        <Option value="xiao">付晓晓</Option>
                        <Option value="mao">周毛毛</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.dateRange}>
                    {getFieldDecorator('dateRange', {
                      rules: [{required: true, message: 'Please select the effective date'}],
                    })(
                      <RangePicker
                        placeholder={['start date', 'End date']}
                        style={{width: '100%'}}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      rules: [{required: true, message: 'Please select a warehouse type'}],
                    })(
                      <Select placeholder="Please select a warehouse type">
                        <Option value="private">Private</Option>
                        <Option value="public">public</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Task management" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.name2}>
                    {getFieldDecorator('name2', {
                      rules: [{required: true, message: 'please enter'}],
                    })(<Input placeholder="please enter"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.url2}>
                    {getFieldDecorator('url2', {
                      rules: [{required: true, message: 'please choose'}],
                    })(<Input placeholder="please enter"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.owner2}>
                    {getFieldDecorator('owner2', {
                      rules: [{required: true, message: 'Please select an administrator'}],
                    })(
                      <Select placeholder="Please select an administrator">
                        <Option value="xiao">Fu Xiaoxiao</Option>
                        <Option value="mao">Zhou Maomao</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.approver2}>
                    {getFieldDecorator('approver2', {
                      rules: [{required: true, message: 'Please select an approver'}],
                    })(
                      <Select placeholder="Please select an approver">
                        <Option value="xiao">Fu Xiaoxiao</Option>
                        <Option value="mao">Zhou Maomao</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.dateRange2}>
                    {getFieldDecorator('dateRange2', {
                      rules: [{required: true, message: 'please enter'}],
                    })(
                      <TimePicker
                        placeholder="Reminder time"
                        style={{width: '100%'}}
                        getPopupContainer={trigger => {
                          if (trigger && trigger.parentNode) {
                            return trigger.parentNode as HTMLElement;
                          }
                          return trigger;
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.type2}>
                    {getFieldDecorator('type2', {
                      rules: [{required: true, message: 'Please select a warehouse type'}],
                    })(
                      <Select placeholder="Please select a warehouse type">
                        <Option value="private">Private</Option>
                        <Option value="public">Private</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Member management" bordered={false}>
            {getFieldDecorator('members', {
              initialValue: tableData,
            })(<TableForm/>)}
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar style={{width}}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            submit
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<AdvancedFormProps>()(AdvancedForm);
