export default {
  namespace: 'addLine',
  state: {
    data: {
      isPedding: false, // 是否等待点击第二个点
      type: 'begin', // begin、end
      firstNodeId: '', // 第一个点的id
    },
  },
  reducers: {
    changeAddLine(state, { payload: newState }) {
      // console.warn('获取到参数列表并返给state', newState)
      // const nextCounter = state.counter + 1
      // const newCardWithId = { ...newCard, id: nextCounter }
      // const nextData = state.data.concat(newCardWithId)

      // let key = newParams.key
      // let name = newParams.name
      // let value = newParams.value

      let result = { ...state };
      result.data = newState;
      return result;
    },
  },
};
