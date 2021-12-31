// import request from '../util/request'
// import { message } from 'antd'

export default {
  namespace: 'flowForm',
  state: {
    data: {
      Name: '',
      Id: '',
      Description: '',
      Creator: '',
    },
  },
  reducers: {
    changeFlowForm(state, { payload: newForm }) {
      // console.warn('获取到参数列表并返给state', newForm)
      // const nextCounter = state.counter + 1
      // const newCardWithId = { ...newCard, id: nextCounter }
      // const nextData = state.data.concat(newCardWithId)

      // let key = newParams.key
      // let name = newParams.name
      // let value = newParams.value

      let result = { ...state };
      result.data = newForm;
      return result;
    },
  },
};
