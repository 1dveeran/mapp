import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  Popover,
  Row,
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
  t_55: 't_55',
t_54: 't_54',
t_53: 't_53',
t_52: 't_52',
t_51: 't_51',
t_61: 't_61',
t_62: 't_62',
t_63: 't_63',
t_64: 't_64',
t_65: 't_65',
t_18: 't_18',
t_17: 't_17',
t_16: 't_16',
t_15: 't_15',
t_14: 't_14',
t_13: 't_13',
t_12: 't_12',
t_11: 't_11',
t_21: 't_21',
t_22: 't_22',
t_23: 't_23',
t_24: 't_24',
t_25: 't_25',
t_26: 't_26',
t_27: 't_27',
t_28: 't_28',
t_48: 't_48',
t_47: 't_47',
t_46: 't_46',
t_45: 't_45',
t_44: 't_44',
t_43: 't_43',
t_42: 't_42',
t_41: 't_41',
t_31: 't_31',
t_32: 't_32',
t_33: 't_33',
t_34: 't_34',
t_35: 't_35',
t_36: 't_36',
t_37: 't_37',
t_38: 't_38',
t_85: 't_85',
t_84: 't_84',
t_83: 't_83',
t_82: 't_82',
t_81: 't_81',
t_71: 't_71',
t_72: 't_72',
t_73: 't_73',
t_74: 't_74',
t_75: 't_75',
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
class DiagnosisInformation extends Component<DiagnosisInformationProps> {
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
          type: 'diagnosisInfo/submitDiagnosisInfo',
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
                    <Form.Item>{getFieldDecorator('t_55')(<Input placeholder="55" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_54')(<Input placeholder="54" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_52')(<Input placeholder="52" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_51')(<Input placeholder="51" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_61')(<Input placeholder="61" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_53')(<Input placeholder="53" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_62')(<Input placeholder="62" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_63')(<Input placeholder="63" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_64')(<Input placeholder="64" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_65')(<Input placeholder="65" />)}</Form.Item>
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_18')(<Input placeholder="18" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_17')(<Input placeholder="17" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_16')(<Input placeholder="16" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_15')(<Input placeholder="15" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_14')(<Input placeholder="14" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_13')(<Input placeholder="13" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_12')(<Input placeholder="12" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_11')(<Input placeholder="11" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_21')(<Input placeholder="21" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_22')(<Input placeholder="22" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_23')(<Input placeholder="23" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_24')(<Input placeholder="24" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_25')(<Input placeholder="25" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_26')(<Input placeholder="26" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_27')(<Input placeholder="27" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_28')(<Input placeholder="28" />)}</Form.Item>
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_48')(<Input placeholder="48" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_47')(<Input placeholder="47" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_46')(<Input placeholder="46" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_45')(<Input placeholder="45" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_44')(<Input placeholder="44" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_43')(<Input placeholder="43" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_42')(<Input placeholder="42" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_41')(<Input placeholder="41" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_31')(<Input placeholder="31" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_32')(<Input placeholder="32" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_33')(<Input placeholder="33" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_34')(<Input placeholder="34" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_35')(<Input placeholder="35" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_36')(<Input placeholder="36" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_37')(<Input placeholder="37" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_38')(<Input placeholder="38" />)}</Form.Item>
                  </Col>
                </InputGroup>
              </Row>

              <Row gutter={0}>
                <InputGroup compact>
                  <Col xl={{ span: 2, offset: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_85')(<Input placeholder="85" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_84')(<Input placeholder="84" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_83')(<Input placeholder="83" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_82')(<Input placeholder="82" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_81')(<Input placeholder="81" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_71')(<Input placeholder="71" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_72')(<Input placeholder="72" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_73')(<Input placeholder="73" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_74')(<Input placeholder="74" />)}</Form.Item>
                  </Col>
                  <Col xl={{ span: 2 }} lg={{ span: 4 }} md={{ span: 8 }} sm={12}>
                    <Form.Item>{getFieldDecorator('t_75')(<Input placeholder="75" />)}</Form.Item>
                  </Col>
                </InputGroup>
              </Row>
              <Row style={{ marginBottom: 16 }}></Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.toothList}>
                    {getFieldDecorator('t_others', {
                      rules: [{ required: false, message: 'Please enter the address' }],
                    })(
                      <TextArea
                        rows={3}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('is_radiograph_iopa', {
                      initialValue: false,
                      valuePropName: 'checked',
                    })(<Checkbox>IOPA</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('is_radiograph_opg', {
                      initialValue: false,
                      valuePropName: 'checked',
                    })(<Checkbox>OPG</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('is_radiograph_occlusal', {
                      initialValue: false,
                      valuePropName: 'checked',
                    })(<Checkbox>Occlusal</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('is_radiograph_bitewing', {
                      initialValue: false,
                      valuePropName: 'checked',
                    })(<Checkbox>Bitewing</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('radiograph_others', {
                      initialValue: false,
                      valuePropName: 'checked',
                    })(<Checkbox>Others</Checkbox>)}
                  </Form.Item>
                  <Form.Item label={fieldLabels.radioGraph}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.diagnosis}>
                    {getFieldDecorator('diagnosis', {
                      rules: [{ required: true, message: 'Please enter the diagnosis' }],
                    })(
                      <TextArea
                        rows={3}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabels.treatmentPlan}>
                    {getFieldDecorator('treatment_plan', {
                      rules: [{ required: false, message: 'Please enter the treatment plan' }],
                    })(
                      <TextArea
                        rows={3}
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

export default Form.create<DiagnosisInformationProps>()(DiagnosisInformation);
