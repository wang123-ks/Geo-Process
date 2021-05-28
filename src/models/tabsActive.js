// import request from '../util/request'
// import { message } from 'antd'

export default {
    namespace: 'tabsActive',
    state: {
        active: 'paramsInput'
    },
    reducers: {
        switchTabs(state, { payload: newActive }) {
            let result = {...state}
            result.active = newActive
            console.warn('修改标签页激活项', result)
            return result
        }
    },
};