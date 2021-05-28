// import request from '../util/request'
// import { message } from 'antd'

export default {
    namespace: 'processList',
    state: {
        data: []
    },
    reducers: {
        addProcess(state, { payload: newProcess }) {
            console.warn('获取到新流程', newProcess)
            let result = {...state}
            result.data.push(newProcess)
            console.warn('流程最新（添加完）', result)
            return result
        },
        modifyProcess(state, { payload: endTime }) {
            console.warn('获取到结束时间', endTime)
            let result = {...state}
            if (result.data[result.data.length-1] && result.data[result.data.length-1].endTime === undefined) {
                result.data[result.data.length-1].endTime = endTime
            }
            console.warn('流程最新（修改完）', result)
            return result
        }
    },
};