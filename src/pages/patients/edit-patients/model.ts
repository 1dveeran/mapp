import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {message} from 'antd';
import {fakeSubmitForm, queryPatient, queryRule} from './service';
import {IPatientsInformation} from '@/pages/patients/edit-patients/data';

export interface ModalState {
  patientsInformation?: Partial<IPatientsInformation>;
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
    fetchPatient: Effect;
    submitPatientsInfo: Effect;
  };
  reducers: {
    savePatientsInfo: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'patientsInfo',

  state: {
    patientsInformation: {},
    isLoading: false,
  },

  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryRule);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('Download Log: ', response);
    },
    * fetchPatient({payload}, {call, put}) {
      const response = yield call(queryPatient, payload);
      yield put({
        type: 'savePatientsInfo',
        payload: response,
      });
      console.log('Download Log: ', response);
    },
    * submitPatientsInfo({payload}, {call}) {
      yield call(fakeSubmitForm, payload);
      message.success('Submitted successfully');
    },
  },
  reducers: {
    savePatientsInfo(state, action) {
      return {
        ...state,
        patientsInformation: action.payload || {},
      };
    },
  },
};

export default Model;
