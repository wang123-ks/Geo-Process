// import request from '../util/request'
// import { message } from 'antd'

export default {
    namespace: 'paramsInput',
    state: {
        data: {
            // 'tile_cut': {
            //     // 'minLevel': '5',
            //     // 'maxLevel': '12',
            //     // 'simplifywhether': '是,是,是,是,是,是,是,是',
            // },
            // 'copy_cd_data': {
            //     // 'rtnUrl': 999,
            //     // 'layerName': 888,
            // },
            // 'select_cd_data': {
            //     // 'srcUrl': 777,
            // },
        }
    },
    reducers: {
        changeParamsInput(state, { payload: newParams }) {
            // console.warn('获取到参数列表并返给state', paramsNewList)
            // const nextCounter = state.counter + 1
            // const newCardWithId = { ...newCard, id: nextCounter }
            // const nextData = state.data.concat(newCardWithId)
            let key = newParams.key
            let name = newParams.name
            let value = newParams.value

            let result = {...state}
            result.data[key][name] = value
            return result
        },
        uploadParamsType(state, { payload: paramsKey }) {
            // console.warn('获取到参数类型', paramsKey)
            let result = {...state}
            if (result.data[paramsKey] === undefined) {
                result.data[paramsKey] = {}
            }
            // console.warn('获取到参数类型', paramsKey, result)
            return result
        }
    },
};