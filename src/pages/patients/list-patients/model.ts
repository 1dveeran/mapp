import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {queryPatientsList} from './service';

import {IPatientList} from './data.d';

export interface ModalState {
  patientListInfo?: Partial<IPatientList>;
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
  };
  reducers: {
    savePatientList: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'patientList',

  state: {
    patientListInfo: {},
    isLoading: false,
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryPatientsList);
      yield put({
        type: 'savePatientList',
        payload: response,
      });
      console.log('Download Log: ', response);
    },    
  },
  reducers: {
    savePatientList(state, action) {
      return {
        ...state,
        patientListInfo: action.payload || {},
      };
    },
  },
};

export default Model;
