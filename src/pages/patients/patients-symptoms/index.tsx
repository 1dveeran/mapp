import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';
import { IDiagnosisInformation } from './data.d';

const InputGroup = Input.Group;

const fieldLabels = {
  bp: 'BP',
  pulse: 'Pulse',
  breath: 'Breath',
  bloodSugarLevel: 'Blood Sugar Level',
  toothList: 'D: Decay, F: Filled, M: Missing, R: Root Stump, P: Prosthesis, I: Impected',
  radioGraph: 'Radiograph',
  diagnosis: 'Diagnosis',
  treatmentPlan: 'Treatment Plan',
  iopa: 'IOPA',
  opg: 'OPG',
  occlusal: 'Occlusal',
  bitewing: 'Bitewing',
  others: 'Others',
};

interface DiagnosisInformationProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  diagnosisInformation: IDiagnosisInformation;
  submitting: boolean;
}

@connect(
  ({
    loading,
    diagnosisInfo,
  }: {
    loading: { effects: { [key: string]: boolean } };
    diagnosisInfo: { diagnosisInformation: IDiagnosisInformation };
  }) => ({
    submitting: loading.effects['diagnosisInfo/submitDiagnosisInfo'],
    diagnosisInformation: diagnosisInfo.diagnosisInformation,
  }),
)
class AdvancedForm extends Component<DiagnosisInformationProps> {
  state = {
    width: '100%',
    disabledSmoking: true,
    disabledPregnancyDueDate: true,
  };

  componentDidMount() {
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
          <Icon type="cross-circle-o" className={styles.errorIcon} />
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
          <Icon type="exclamation-circle" />
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
  };

  handleSmokingChange = (value: any, event: any) => {
    if (value === 'yes') {
      this.setState({
        disabledSmoking: false,
      });
    } else if (value === 'no') {
      this.setState({
        disabledSmoking: true,
      });
    }
  };

  handlePregnancyDueDateChange = (value: any, event: any) => {
    if (value === 'yes') {
      this.setState({
        disabledPregnancyDueDate: false,
      });
    } else if (value === 'no') {
      this.setState({
        disabledPregnancyDueDate: true,
      });
    }
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
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
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width } = this.state;
    return (
      <>
        <PageHeaderWrapper content="Enter the valid information about the patients.">
          <Card title="Vitals" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col xl={{ span: 4 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.bp}>
                    {getFieldDecorator('bp', {
                      rules: [{ required: true, message: 'Please enter BP' }],
                    })(<Input placeholder="Please enter BP" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.pulse}>
                    {getFieldDecorator('pulse', {
                      rules: [{ required: true, message: 'Please enter pulse' }],
                    })(<Input placeholder="Please enter pulse" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.breath}>
                    {getFieldDecorator('breath', {
                      rules: [{ required: true, message: 'Please select breath' }],
                    })(<Input placeholder="Please enter pulse" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 4, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.bloodSugarLevel}>
                    {getFieldDecorator('bloodSugarLevel', {
                      rules: [{ required: true, message: 'Please select Blood Sugar Level' }],
                    })(<Input placeholder="Please enter Blood Sugar Level" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="Clinical Features" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2, offset: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="55" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="54" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="52" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="51" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="61" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="53" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="62" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="63" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="64" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="65" />
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="18" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="17" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="16" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="15" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="14" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="13" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="12" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="11" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="21" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="22" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="23" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="24" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="25" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="26" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="27" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="28" />
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="48" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="47" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="46" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="45" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="44" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="43" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="42" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="41" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="31" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="32" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="33" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="34" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="35" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="36" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="37" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="38" />
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2, offset: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="85" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="84" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="83" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="82" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="81" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="71" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="72" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="73" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="74" />
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Input placeholder="75" />
                  </Col>
                </InputGroup>
              </Row>
              <Row style={{ marginBottom: 16 }}></Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.toothList}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('aids', {
                      // rules: [{ required: true, message: 'please select disease' }],
                      initialValue: patientsInformation.aids || '',
                      valuePropName: 'checked',
                    })(<Checkbox>AIDS</Checkbox>)}
                  </Form.Item>
                  <Form.Item label={fieldLabels.radioGraph}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.diagnosis}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.treatmentPlan}>
                    <TextArea rows={3} />
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

export default Form.create<AdvancedFormProps>()(AdvancedForm);
