import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input, Tooltip } from 'antd';
import { PlayCircleOutlined, PlayCircleFilled, PlayCircleTwoTone } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import styles from './index.less';

const namespace = 'processList';

const mapStateToProps = (state) => {
  const processList = state[namespace].data;
  return {
    processList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addProcessNode: (newNode) => {
      dispatch({
        type: `${namespace}/addProcess`,
        payload: newNode,
      });
    },
    modifyProcessNode: (endTime) => {
      dispatch({
        type: `${namespace}/modifyProcess`,
        payload: endTime,
      });
    },
    modifyTabsActive: (active) => {
      dispatch({
        type: 'tabsActive/switchTabs',
        payload: active,
      });
    },
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class Execute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  selectNodes = (nodeId) => {
    const { propsAPI } = this.props;

    // propsAPI.executeCommand('clear') // clear 清空画布

    // propsAPI.read(mockFlowData2) // 更新全部

    // const curFlowData = propsAPI.save();
    // console.warn('当前项', curFlowData); // 获取当前项

    // let type = 'node';
    // let model = {
    //   label: '添加测试',
    //   color: '#E76F00',
    //   key_a: 'addTest',
    //   "x": 56.671875,
    //   "y": 133,
    //   "shape": "flow-circle",
    //   "size": "84*84",
    // };
    // propsAPI.add(type, model)   //添加某一项

    // const node = propsAPI.find(nodeId);
    // console.warn('打印node', node ) // 按nodeId查找

    // let model = {
    //   label: '添加测试',
    //   color: '#E76F00',
    //   key_a: 'addTest',
    //   // "x": 56.671875,
    //   // "y": 133,
    //   "shape": "flow-circle",
    //   "size": "84*84",
    // };
    // propsAPI.update(nodeId, model)   //添加某一项

    // propsAPI.remove(nodeId)

    // let selects = propsAPI.getSelected()
    // console.warn('打印selects', selects ) // 获取选中项

    const node = propsAPI.find(nodeId);
    propsAPI.currentPage.clearSelected();
    propsAPI.currentPage.setSelected(node, true);
  };

  getNodeId = (key_a) => {
    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();
    console.warn('dangqian', curFlowData);
    let result = '';
    if (curFlowData.nodes && curFlowData.nodes.length > 0) {
      for (let i = 0; i < curFlowData.nodes.length; i++) {
        if (curFlowData.nodes[i].key_a === key_a) {
          result = curFlowData.nodes[i].id;
          break;
        }
      }
    }
    return result;
  };

  start = new Promise(function (resolve, reject) {
    resolve();
  });

  startandEnd = (state, desc, key_a, time, timeFaker) => {
    let vm = this;
    let nodeId = this.getNodeId(key_a);
    if (state === 'start') {
      setTimeout(function () {
        let newProcess = {
          title: desc,
          // startTime: '开始时间：' + new Date().toLocaleString(),
          // endTime: '结束时间：' + new Date().toLocaleString(),
          startTime: '开始时间：' + timeFaker,
          endTime: '结束时间：' + timeFaker,
          state: 'start',
        };
        vm.props.addProcessNode(newProcess);
        vm.selectNodes(nodeId);
        // console.log(desc)
        // console.log('开始时间 -', new Date().toLocaleString())
        // console.log('结束时间 -', new Date().toLocaleString())
        // func(param);
        // console.log('-----------------')
      }, 0);

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, time);
      });
    } else if (state === 'end') {
      // let endTime = '结束时间：' + new Date().toLocaleString()
      let endTime = '结束时间：' + timeFaker;
      vm.props.modifyProcessNode(endTime);
      // console.log('结束步骤 - ？')
      // console.log('结束时间 - ', new Date().toLocaleString())
      // console.log(desc)
      let newEndProcess = {
        title: desc,
        // startTime: '开始时间：' + new Date().toLocaleString(),
        // endTime: '结束时间：' + new Date().toLocaleString(),
        startTime: '开始时间：' + timeFaker,
        endTime: '结束时间：' + timeFaker,
        state: 'end',
      };
      vm.props.addProcessNode(newEndProcess);
      vm.selectNodes(nodeId);
    }
    return null;
  };

  step = (func, param, key_a, time, timeFaker) => {
    // 执行异步操作1
    let vm = this;
    let nodeId = this.getNodeId(key_a);
    // let endTime = '结束时间：' + new Date().toLocaleString()
    let endTime = '结束时间：' + timeFaker;
    vm.props.modifyProcessNode(endTime);
    // console.log('结束步骤 - ？')
    // console.log('结束时间 - ', new Date().toLocaleString())

    setTimeout(function () {
      // console.log('开始步骤 -', param)
      console.log('当前时间', new Date());
      let newProcess = {
        title: param,
        // startTime: '开始时间：' + new Date().toLocaleString(),
        startTime: '开始时间：' + timeFaker,
        // endTime: new Date().toLocaleString(),
        // state: "start"
      };
      vm.props.addProcessNode(newProcess);
      vm.selectNodes(nodeId);
      func(param);
      // console.log('-----------------')
    }, 0); //这里的1500 是真实的时间消耗

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, time); //这里的time是根据硬件显卡估计的时间消耗
    });
  };

  onlyText = (param) => {
    console.warn(param, '——执行中');
  };

  modalCallback = (param) => {
    console.warn(param, '——执行中');
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    console.warn('点击确定！');
    this.props.modifyTabsActive('taskInfo');
    this.setState({ isModalVisible: false });

    this.start
      .then(() =>
        this.startandEnd('start', '开始任务', 'task_start', 200, '2021/5/10 下午14:07:16'),
      )
      .then(() =>
        this.step(this.onlyText, '输入矢量数据', 'select_cd_data', 6200, '2021/5/10 下午14:07:16'),
      )
      // .then(() =>
      //   this.step(this.onlyText, '验证大数据环境', 'select_cd_data', 500, '2021/5/10 下午15:09:32'),
      // )
      // .then(() =>
      //   this.step(this.onlyText, '验证模型参数', 'select_cd_data', 500, '2021/5/10 下午15:14:10'),
      // )
      .then(() =>
        this.step(
          this.onlyText,
          '创建空间索引',
          'create_spatial_index',
          3600,
          '2021/5/10 下午15:20:11',
        ),
      ) // 实际为11s
      .then(() =>
        this.step(this.onlyText, '创建元数据', 'create_metadata', 1500, '2021/5/10 下午15:55:31'),
      )
      .then(() =>
        this.step(
          this.onlyText,
          '创建瓦片索引',
          'create_tile_index',
          2400,
          '2021/5/10 下午16:10:23',
        ),
      )
      .then(() =>
        this.step(
          this.modalCallback,
          '执行模型——过滤',
          'tile_filter',
          1500,
          '2021/5/10 下午16:34:34',
        ),
      )
      .then(() =>
        this.step(
          this.modalCallback,
          '执行模型——化简',
          'tile_simplify',
          4500,
          '2021/5/10 下午16:49:22',
        ),
      ) // 实际为11s
      .then(() =>
        this.step(
          this.modalCallback,
          '执行模型——生成pbf',
          'generate_pbf',
          2400,
          '2021/5/10 下午17:32:47',
        ),
      ) // 实际为5min-6mim
      .then(() =>
        this.step(this.onlyText, '输出瓦片数据', 'copy_cd_data', 4500, '2021/5/10 下午17:56:40'),
      )
      .then(() => this.startandEnd('end', '结束任务', 'task_end', 200, '2021/5/10 下午18:42:45'));
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    return (
      <div>
        <Tooltip title="执行" placement="bottom" overlayClassName={styles.tooltip}>
          <div onClick={this.showModal} style={{ ['marginLeft']: 20 }}>
            <PlayCircleTwoTone style={{ cursor: 'pointer' }} />
          </div>
        </Tooltip>
        <Modal
          title="是否执行"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请确认所有参数已填写完毕！</p>
        </Modal>
      </div>
    );
  }
}

export default withPropsAPI(Execute);
