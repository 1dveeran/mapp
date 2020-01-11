import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { updateDiagnosisInfo, queryDiagnosis, queryRule } from './service';
import { IDiagnosisInformation } from '@/pages/patients/patients-symptoms/data';

export interface ModalState {
  diagnosisInformation?: Partial<IDiagnosisInformation>;
  isLoading?: boolean;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetch: Effect;
    fetchDiagnosis: Effect;
    submitDiagnosisInfo: Effect;
  };
  reducers: {
    saveDiagnosisInfo: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'diagnosisInfo',

  state: {
    diagnosisInformation: {},
    isLoading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('Download Log: ', response);
    },
    *fetchDiagnosis({ payload }, { call, put }) {
      const response = yield call(queryDiagnosis, payload);
      yield put({
        type: 'saveDiagnosisInfo',
        payload: response,
      });
      console.log('Download Log: ', response);
    },
    *submitDiagnosisInfo({ payload }, { call }) {
      yield call(updateDiagnosisInfo, payload);
      console.log('Patients Symptoms | Response: ', payload);
      message.success('Updated successfully');
    },
  },
  reducers: {
    saveDiagnosisInfo(state, action) {
      return {
        ...state,
        diagnosisInformation: action.payload || {},
      };
    },
  },
};

export default Model;
