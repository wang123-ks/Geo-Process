import React from 'react';
import { message } from 'antd';
import { ExpandAltOutlined } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import styles from './index.less';
import { connect } from 'dva';

const namespace = 'addLine';

const mapStateToProps = (state: any) => {
  const addLineState = state[namespace];
  return {
    addLineState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleAddLineChange: (state) => {
      const action = {
        type: `${namespace}/changeAddLine`,
        payload: state,
      };
      dispatch(action);
    },
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class addLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isModalVisible: false,
    };
  }

  addLineClick = (event) => {
    const { propsAPI } = this.props;
    message.info(`请点击选择${this.props.type === 'begin' ? '终点' : '起点'}`);

    // 关闭右键菜单
    let contextMenu = document.getElementsByClassName('contextMenu___3VXce');
    contextMenu[0].style.display = 'none';

    // console.warn('打印dva1', this.props.addLineState)
    let selects = propsAPI.getSelected();
    let state = {
      isPedding: true,
      type: this.props.type,
      firstNodeId: selects[0].id,
    };
    this.props.handleAddLineChange(state);
  };

  render() {
    return (
      <div className={styles.item} onClick={this.addLineClick}>
        <ExpandAltOutlined />
        <span>连线{this.props.type === 'begin' ? '（作为起点）' : '（作为终点）'}</span>
      </div>
    );
  }
}

export default withPropsAPI(addLine);
