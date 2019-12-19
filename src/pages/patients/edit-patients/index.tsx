import { Button, Card, Checkbox, Col, DatePicker, Form, Icon, Input, Popover, Row, Select } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import { IPatientsInformation } from './data.d';

const { Option } = Select;
const { RangePicker } = DatePicker;
const beginDay = new Date().getTime();

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
  { label: 'Penicillin', value: 'Penicillin' },
  { label: 'Sulfa', value: 'Sulfa' },
  { label: 'Aspirin', value: 'Aspirin' },
  { label: 'Iodine', value: 'Iodine' },
  { label: 'Local Anaesthetic', value: 'Local Anaesthetic' },
  { label: 'Ibuprofen', value: 'Ibuprofen' },
];

const diseaseList = [
  { label: 'AIDS', value: 'AIDS' },
  { label: 'Cancer', value: 'Cancer' },
  { label: 'Liver Disease', value: 'Liver Disease' },
  { label: 'TB', value: 'TB' },
  { label: 'Asthma', value: 'Asthma' },
  { label: 'Diabetes', value: 'Diabetes' },
  { label: 'Kidney Disease', value: 'Kidney Disease' },
  { label: 'Rheumatic Fever', value: 'Rheumatic Fever' },
  { label: 'Arthritis', value: 'Arthritis' },
  { label: 'Epilepsy', value: 'Epilepsy' },
  { label: 'Psychiatric Treatment', value: 'Psychiatric Treatment' },
  { label: 'Thyroid Problems', value: 'Thyroid Problems' },
  { label: 'Blood Disease', value: 'Blood Disease' },
  { label: 'Hepatitis', value: 'Hepatitis' },
  { label: 'Radiation Treatment', value: 'Radiation Treatment' },
  { label: 'Ulcer', value: 'Ulcer' },
  { label: 'BP High/Low', value: 'BP High/Low' },
  { label: 'Herpes', value: 'Herpes' },
  { label: 'Respiratory Disease', value: 'Respiratory Disease' },
  { label: 'Venereal Disease', value: 'Venereal Disease' },
  { label: 'Heart Problems', value: 'Heart Problems' },
  { label: 'Jaundice', value: 'Jaundice' },
  { label: 'Corticosteriod Treatment', value: 'Corticosteriod Treatment' },
];

interface PatientInformationProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  patientsInformation: IPatientsInformation;
  submitting: boolean;
}

@connect(
  ({
     loading,
     patientsInfo,
   }: {
    loading: { effects: { [key: string]: boolean } };
    patientsInfo: { patientsInformation: IPatientsInformation };
  }) => ({
    submitting: loading.effects['patientsInfo/submitPatientsInfo'],
    patientsInformation: patientsInfo.patientsInformation,
  }))
class PatientInformation extends Component<PatientInformationProps> {
  state = {
    width: '100%',
    disabledSmoking: true,
    disabledPregnancyDueDate: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'patientsInfo/fetchPatient',
      payload: {
        patient_id: 1,
      },
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
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
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
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
      // this.props.form.set
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
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'patientsInfo/submitPatientsInfo',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      patientsInformation,
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;
    return (
      <>
        <PageHeaderWrapper content="Enter the valid information about the patients.">
          <Card title="Personal Information" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.firstName}>
                    {getFieldDecorator('firstName', {
                      rules: [{ required: true, message: 'Please enter first name' }],
                      initialValue: patientsInformation.first_name,
                    })(<Input placeholder="Please enter first name"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.lastName}>
                    {getFieldDecorator('lastName', {
                      rules: [{ required: true, message: 'Please enter last name' }],
                      initialValue: patientsInformation.last_name,
                    })(<Input placeholder="Please enter last name"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.date}>
                    {getFieldDecorator('date', {
                      rules: [{ required: true, message: 'Please select date' }],
                      initialValue: moment(patientsInformation.birth_date),
                    })(
                      <DatePicker
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.address}>
                    {getFieldDecorator('address', {
                      rules: [{ required: true, message: 'Please enter the address' }],
                      initialValue: patientsInformation.current_address,
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
                      rules: [{ required: true, message: 'Please enter profession' }],
                      initialValue: patientsInformation.profession,
                    })(<Input placeholder="Please enter profession"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.telephoneNumber}>
                    {getFieldDecorator('telephoneNumber', {
                      rules: [{ required: true, message: 'Please enter telephone no.' }],
                      initialValue: patientsInformation.telephone_no,
                    })(<Input placeholder="Please enter teletphone no."/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.mobileNumber}>
                    {getFieldDecorator('mobileNumber', {
                      rules: [{ required: true, message: 'Please enter mobile no.' }],
                      initialValue: patientsInformation.mobile_no,
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
                      rules: [{ required: true, message: 'Please select gender' }],
                      initialValue: patientsInformation.sex,
                    })(
                      <Select placeholder="Please select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.age}>
                    {getFieldDecorator('age', {
                      rules: [{ required: true, message: 'Please enter age' }],
                      initialValue: patientsInformation.age,
                    })(
                      <Input
                        maxLength={2}
                        placeholder="please enter age"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 1 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.maritalStatus}>
                    {getFieldDecorator('maritalStatus', {
                      rules: [{ required: true, message: 'Please select Marital Status' }],
                      initialValue: patientsInformation.marital_status ? 'yes' : 'no',
                    })(
                      <Select placeholder="Please select Marital Status">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.dateOfBirth}>
                    {getFieldDecorator('dateOfBirth', {
                      rules: [{ required: true, message: 'Please select date of birth' }],
                      initialValue: moment(patientsInformation.birth_date),
                    })(
                      <DatePicker
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Medical Information" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={24}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('aids', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.aids || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>AIDS</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('cancer', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.cancer || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Cancer</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('liver_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.liver_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Liver Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('tb', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.tb || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>TB</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('asthma', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.asthma || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Asthma</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('diabetes', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.diabetes || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Diabetes</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('diabetes', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.diabetes || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Diabetes</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('kidney_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.kidney_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Kidney Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('rheumatic_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.rheumatic_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Rheumatic Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('arthritis', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.arthritis || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Arthritis</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('epilepsy', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.epilepsy || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Epilepsy</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('psychiatric_treatment', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.psychiatric_treatment || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Psychiatric Treatment</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('thyroid_problems', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.thyroid_problems || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Thyroid Problems</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('blood_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.blood_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Blood Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('hepatitis', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.hepatitis || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Hepatitis</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('radation_treatment', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.radiation_treatment || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Radiation Treatment</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('ulcer', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.ulcer || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Ulcer</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('bp', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.bp || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>BP High/Low</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('herpes', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.herpes || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Herpes</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('respiratory_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.respiratory_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Respiratory Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('venereal_disease', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.venereal_disease || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Venereal Disease</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('heart_problems', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.heart_problems || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Heart Problem</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('jaundice', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.jaundice || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Jaundice</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('corticosteriod_treatment', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.corticosteriod_treatment || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Corticosteriod Treatment</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.isNursing}>
                    {getFieldDecorator('isNursing', {
                      rules: [{ required: true, message: 'Are you Nursing' }],
                      initialValue: patientsInformation.is_nursing ? 'yes' : 'no',
                    })(
                      <Select placeholder="Are you Nursing">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.isPregnant}>
                    {getFieldDecorator('isPregnant', {
                      rules: [{ required: true, message: 'Are you pregnant' }],
                      initialValue: patientsInformation.is_pregnant ? 'yes' : 'no',
                    })(
                      <Select placeholder="Are you pregnant"
                              onSelect={(value, event) => this.handlePregnancyDueDateChange(value, event)}>
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.pregnancyDueDate}>
                    {getFieldDecorator('pregnancyDueDate', {
                      rules: [{ required: true, message: 'Please select due date' }],
                      initialValue: moment(patientsInformation.pregnancy_due_date),
                    })(
                      <DatePicker
                        disabled={this.state.disabledPregnancyDueDate}
                        showToday
                        mode="date"
                        format="DD-MM-YYYY"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.isChewing}>
                    {getFieldDecorator('isChewing', {
                      rules: [{ required: true, message: 'Are you chewing paan' }],
                      initialValue: patientsInformation.is_chewing ? 'yes' : 'no',
                    })(
                      <Select placeholder="Are you chewing paan">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.isSmoking}>
                    {getFieldDecorator('isSmoking', {
                      rules: [{ required: true, message: 'Are you smoking' }],
                      initialValue: patientsInformation.is_smoking ? 'yes' : 'no',
                    })(
                      <Select placeholder="Are you smoking"
                              onSelect={(value, event) => this.handleSmokingChange(value, event)}>
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.cigaretteCount}>
                    {getFieldDecorator('cigaretteCount', {
                      rules: [{ required: true, message: 'Please enter cigarette count' }],
                      initialValue: patientsInformation.cigarette_count,
                    })(
                      <Input
                        disabled={this.state.disabledSmoking}
                        maxLength={2}
                        placeholder="please enter cigarette count"/>,
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
                      rules: [{ required: true, message: 'List the Medicines you are taking currently' }],
                      initialValue: patientsInformation.medicine_list,
                    })(
                      <TextArea
                        rows={3}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_penicillin', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_penicillin || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Penicillin</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_sulfa', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_sulfa || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Sulfa</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_aspirin', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_aspirin || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Aspirin</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_iodine', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_iodine || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Iodine</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_localanaes', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_localanaes || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Local Anaesthetic</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_allergic_ibuprofen', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.is_allergic_ibuprofen || '',
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Ibuprofen</Checkbox>,
                    )}
                  </Form.Item>
                </Col>
                {/* <Form.Item label={fieldLabels.isAllergic}> */}
                {/*  {getFieldDecorator('isAllergic', { */}
                {/*    rules: [{ required: true, message: 'Please select allergic medicines' }], */}
                {/*    initialValue: patientsInformation.is_allergic_aspirin, */}
                {/*  })( */}
                {/*    <Checkbox.Group */}
                {/*      options={allergicMedicines} */}
                {/*      onChange={this.onChangeCheckBox} */}
                {/*    />, */}
                {/*  )} */}
                {/* </Form.Item> */}
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.anyOther}>
                    {getFieldDecorator('anyOther', {
                      rules: [{ required: true, message: 'Any Other' }],
                      initialValue: patientsInformation.any_other,
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
                      rules: [{ required: true, message: 'Chief Compliant' }],
                      initialValue: patientsInformation.chief_compliant,
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
                      rules: [{ required: true, message: 'Past Dental History' }],
                      initialValue: patientsInformation.past_dental_history,
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
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            submit
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<PatientInformationProps>()(PatientInformation);
