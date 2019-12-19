import {Button, Card, Checkbox, Col, DatePicker, Form, Icon, Input, Popover, Row, Select,} from 'antd';
import React, {Component} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const {Option} = Select;
const {RangePicker} = DatePicker;

const fieldLabels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  date: 'Date',
  address: 'Address',
  sex: 'Sex',
  age: 'Age',
  dateOfBirth: 'Date Of Birth',
  maritalStatus: 'Marital Status',
  profession: 'Profession',
  telephoneNumber: 'Telephone No.',
  mobileNumber: 'Mobile No.',
  isPregnant: 'Is Pregnant',
  isNursing: 'Is Nursing',
  isChewing: 'Is Chewing',
  isSmoking: 'Is Smoking',
  cigaretteCount: 'Cigarette Count',
  pregnancyDueDate: 'Pregnancy Due Date',
  referedBy: 'Refered By',
  listOfMedicine: 'List the Medicines you are taking currently',
  anyOther: 'Any Other',
  isAllergic: 'Is Allergic',
  chiefCompliant: 'Chief Complianct',
  pastDentalHistory: 'Past Dental History',
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

const allergicMedicines = [
  {label: 'Penicillin', value: 'Penicillin'},
  {label: 'Sulfa', value: 'Sulfa'},
  {label: 'Aspirin', value: 'Aspirin'},
  {label: 'Iodine', value: 'Iodine'},
  {label: 'Local Anaesthetic', value: 'Local Anaesthetic'},
  {label: 'Ibuprofen', value: 'Ibuprofen'},
];

const diseaseList = [
  {label: 'AIDS', value: 'AIDS'},
  {label: 'Cancer', value: 'Cancer'},
  {label: 'Liver Disease', value: 'Liver Disease'},
  {label: 'TB', value: 'TB'},
  {label: 'Asthma', value: 'Asthma'},
  {label: 'Diabetes', value: 'Diabetes'},
  {label: 'Kidney Disease', value: 'Kidney Disease'},
  {label: 'Rheumatic Fever', value: 'Rheumatic Fever'},
  {label: 'Arthritis', value: 'Arthritis'},
  {label: 'Epilepsy', value: 'Epilepsy'},
  {label: 'Psychiatric Treatment', value: 'Psychiatric Treatment'},
  {label: 'Thyroid Problems', value: 'Thyroid Problems'},
  {label: 'Blood Disease', value: 'Blood Disease'},
  {label: 'Hepatitis', value: 'Hepatitis'},
  {label: 'Radiation Treatment', value: 'Radiation Treatment'},
  {label: 'Ulcer', value: 'Ulcer'},
  {label: 'BP High/Low', value: 'BP High/Low'},
  {label: 'Herpes', value: 'Herpes'},
  {label: 'Respiratory Disease', value: 'Respiratory Disease'},
  {label: 'Venereal Disease', value: 'Venereal Disease'},
  {label: 'Heart Problems', value: 'Heart Problems'},
  {label: 'Jaundice', value: 'Jaundice'},
  {label: 'Corticosteriod Treatment', value: 'Corticosteriod Treatment'},
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
    disabledSmoking: true,
    disabledPregnancyDueDate: true,
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

  onChangeCheckBox = (checkedValues: any) => {
    console.log('checked = ', checkedValues);
  }

  handleSmokingChange = (value: any, event: any) => {
    if (value === 'yes') {
      this.setState(
        {
          disabledSmoking: false,
        },
      )
    } else if (value === 'no') {
      this.setState(
        {
          disabledSmoking: true,
        },
      )
    }
  }

  handlePregnancyDueDateChange = (value: any, event: any) => {
    if (value === 'yes') {
      this.setState(
        {
          disabledPregnancyDueDate: false,
        },
      )
    } else if (value === 'no') {
      this.setState(
        {
          disabledPregnancyDueDate: true,
        },
      )
    }
  }


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
        <PageHeaderWrapper content="Enter the valid information about the patients.">
          <Card title="Personal Information" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.firstName}>
                    {getFieldDecorator('firstName', {
                      rules: [{required: true, message: 'Please enter first name'}],
                    })(<Input placeholder="Please enter first name"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.lastName}>
                    {getFieldDecorator('lastName', {
                      rules: [{required: true, message: 'Please enter last name'}],
                    })(<Input placeholder="Please enter last name"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.date}>
                    {getFieldDecorator('date', {
                      rules: [{required: true, message: 'Please select date'}],
                    })(
                      <DatePicker
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{width: '100%'}}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.address}>
                    {getFieldDecorator('address', {
                      rules: [{required: true, message: 'Please enter the address'}],
                    })(
                      <TextArea
                        rows={4}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.profession}>
                    {getFieldDecorator('profession', {
                      rules: [{required: true, message: 'Please enter profession'}],
                    })(<Input placeholder="Please enter profession"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.telephoneNumber}>
                    {getFieldDecorator('telephoneNumber', {
                      rules: [{required: true, message: 'Please enter telephone no.'}],
                    })(<Input placeholder="Please enter teletphone no."/>)}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item label={fieldLabels.mobileNumber}>
                    {getFieldDecorator('mobileNumber', {
                      rules: [{required: true, message: 'Please enter mobile no.'}],
                    })(
                      <Input
                        addonBefore="+91"
                        maxLength={10}
                        placeholder="Please enter mobile no."/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.sex}>
                    {getFieldDecorator('sex', {
                      rules: [{required: true, message: 'Please select gender'}],
                    })(
                      <Select placeholder="Please select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 4, offset: 1}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.age}>
                    {getFieldDecorator('age', {
                      rules: [{required: true, message: 'Please enter age'}],
                    })(
                      <Input
                        maxLength={2}
                        placeholder="please enter age"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 4, offset: 1}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.maritalStatus}>
                    {getFieldDecorator('maritalStatus', {
                      rules: [{required: true, message: 'Please select Marital Status'}],
                    })(
                      <Select placeholder="Please select Marital Status">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 10}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.dateOfBirth}>
                    {getFieldDecorator('dateOfBirth', {
                      rules: [{required: true, message: 'Please select date of birth'}],
                    })(
                      <DatePicker
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{width: '100%'}}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Medical Information" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row>
                <Form.Item label={fieldLabels.name2}>
                  {getFieldDecorator('name2', {
                    rules: [{required: true, message: 'please select disease'}],
                  })(
                    <Checkbox.Group
                      options={diseaseList}
                      onChange={this.onChangeCheckBox}
                    />,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.isNursing}>
                    {getFieldDecorator('isNursing', {
                      rules: [{required: true, message: 'Are you Nursing'}],
                    })(
                      <Select placeholder="Are you Nursing">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.isPregnant}>
                    {getFieldDecorator('isPregnant', {
                      rules: [{required: true, message: 'Are you pregnant'}],
                    })(
                      <Select placeholder="Are you pregnant"
                              onSelect={(value, event) => this.handlePregnancyDueDateChange(value, event)}>
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 10}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.pregnancyDueDate}>
                    {getFieldDecorator('pregnancyDueDate', {
                      rules: [{required: true, message: 'Please select due date'}],
                    })(
                      <DatePicker
                        disabled={this.state.disabledPregnancyDueDate}
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{width: '100%'}}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.isChewing}>
                    {getFieldDecorator('isChewing', {
                      rules: [{required: true, message: 'Are you chewing paan'}],
                    })(
                      <Select placeholder="Are you chewing paan">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.isSmoking}>
                    {getFieldDecorator('isSmoking', {
                      rules: [{required: true, message: 'Are you smoking'}],
                    })(
                      <Select placeholder="Are you smoking"
                              onSelect={(value, event) => this.handleSmokingChange(value, event)}>
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 10}} md={{span: 12}} sm={24}>
                  <Form.Item label={fieldLabels.cigaretteCount}>
                    {getFieldDecorator('cigaretteCount', {
                      rules: [{required: true, message: 'Please enter cigerette count'}],
                    })(
                      <Input
                        disabled={this.state.disabledSmoking}
                        maxLength={2}
                        placeholder="please enter cigerate count"/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Medication" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.listOfMedicine}>
                    {getFieldDecorator('listOfMedicine', {
                      rules: [{required: true, message: 'List the Medicines you are taking currently'}],
                    })(
                      <TextArea
                        rows={3}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Form.Item label={fieldLabels.isAllergic}>
                  {getFieldDecorator('isAllergic', {
                    rules: [{required: true, message: 'Please select allergic medicines'}],
                  })(
                    <Checkbox.Group
                      options={allergicMedicines}
                      onChange={this.onChangeCheckBox}
                    />,
                  )}
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.anyOther}>
                    {getFieldDecorator('anyOther', {
                      rules: [{required: true, message: 'Any Other'}],
                    })(
                      <TextArea
                        rows={2}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Dental Information" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.chiefCompliant}>
                    {getFieldDecorator('chiefCompliant', {
                      rules: [{required: true, message: 'Chief Compliant'}],
                    })(
                      <TextArea
                        rows={2}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.pastDentalHistory}>
                    {getFieldDecorator('pastDentalHistory', {
                      rules: [{required: true, message: 'Past Dental History'}],
                    })(
                      <TextArea
                        rows={2}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
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
