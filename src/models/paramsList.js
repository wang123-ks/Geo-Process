import request from '../util/request'
import { message } from 'antd'

export default {
    namespace: 'paramsList',
    state: {
        isShow: false,
        data: {}
    },
    effects: {
        *queryParams({ payload }, { call, put, select }) {
            yield put({ type: 'paramsInput/uploadParamsType', payload: payload })
            if (payload === undefined) {
                yield put({ type: 'changeShow', payload: false })
            } else {
                try { // 加入 try catch 捕获抛错
                    const curState = yield select(state => state.paramsList.data)
                    if (curState[payload] !== undefined) {
                        let paramsOldList = curState
                        let paramsPayload1 = {
                            key: payload,
                            value: paramsOldList[payload]
                        }
                        yield put({ type: 'getParamsNewList', payload: paramsPayload1 })
                        yield put({ type: 'changeShow', payload: true })
                    } else {
                        const operatorType = payload
                        const endPointURI = '/dev/getParamsByKey'
                        const option = {
                            key: payload
                        }
                        const paramsNewList = yield call(request, endPointURI, option)
                        let paramsPayload2 = {
                            key: payload,
                            value: paramsNewList[payload]
                        }
                        yield put({ type: 'getParamsNewList', payload: paramsPayload2 })
                        yield put({ type: 'changeShow', payload: true })
                        // yield put({ type: 'paramsInput/uploadParamsType', payload: payload })
                    }
                } catch (e) {
                    message.error('参数获取失败'); // 打印错误信息
                }
            }
        }
    },
    reducers: {
        getParamsNewList(state, { payload: paramsPayload }) {
            console.warn('获取到参数列表并返给state', paramsPayload)
            // const nextCounter = state.counter + 1
            // const newCardWithId = { ...newCard, id: nextCounter }
            // const nextData = state.data.concat(newCardWithId)
            let key = paramsPayload.key
            let value = paramsPayload.value
            let result = {...state}
            result.data[key] = value
            // result.isShow = true
            // console.warn('最终state', result)
            return result
        },
        changeShow (state, {payload: isShow}) {
            let result = {...state}
            result.isShow = isShow
            return result
        }
    },
};