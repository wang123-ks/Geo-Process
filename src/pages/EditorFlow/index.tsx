import { Col, Row, Tabs, Timeline, message, Slider } from 'antd';
import GGEditor, { Flow } from 'gg-editor';
import axios from 'axios';

import { connect } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
// import { formatMessage } from 'umi';
import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import UpdateContent from './components/EditorCustom/UpdateContent';
import mockFlowData from './FlowData/mockFlowDataNew';
import styles from './index.less';
import { render } from 'react-dom';

GGEditor.setTrackable(false);

const { TabPane } = Tabs;

const namespace = 'paramsList';
const namespaceProcess = 'processList';

const mapStateToProps = (state) => {
  const paramsList = state[namespace].data;
  const processList = state[namespaceProcess];
  const tabsActive = state['tabsActive'].active;
  const addLineState = state['addLine'];

  return {
    paramsList,
    processList,
    tabsActive,
    addLineState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onClickAdd: (newCard) => {
    //   const action = {
    //     type: `${namespace}/addNewCard`,
    //     payload: newCard,
    //   };
    //   dispatch(action)
    // },
    selectNode: (e) => {
      let { key_a } = e.item.model;
      dispatch({
        type: `${namespace}/queryParams`,
        payload: key_a,
      });
    },
    changeShow: (isShow) => {
      dispatch({
        type: `${namespace}/changeShow`,
        payload: isShow,
      });
    },
    modifyTabsActive: (active) => {
      dispatch({
        type: 'tabsActive/switchTabs',
        payload: active,
      });
    },
    handleAddLineChange: (state) => {
      const action = {
        type: 'addLine/changeAddLine',
        payload: state,
      };
      dispatch(action);
    },
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class FlowTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderSpan: 3,
    };
  }

  // selectNode = (e) => {
  //   console.warn('选择节点', e.item.model)
  // };
  handleNodeSelect(e: any) {
    console.warn('单选', e, e.item.model, e._type);
    this.props.changeShow(false);
    this.props.selectNode(e);
    // this.props.modifyTabsActive('paramsInput');
    // console.warn('这是', this.props.processList);

    // console.warn('打印dva3', JSON.stringify(this.props.addLineState), this.props.addLineState.type)
    if (this.props.addLineState.data.isPedding === true) {
      let addLineState = this.props.addLineState.data;
      let addLine = {
        id: Math.random().toString(36).substr(2),
      };
      if (addLineState.type === 'begin') {
        addLine.source = addLineState.firstNodeId;
        addLine.target = e.item.model.id;
      } else if (addLineState.type === 'end') {
        addLine.source = e.item.model.id;
        addLine.target = addLineState.firstNodeId;
      } else {
        addLine = undefined;
      }
      if (this.updateContent) {
        // 自动连线的相关操作
        this.updateContent.autoAddLine(addLine);
      }

      // 重新初始化
      let state = {
        isPedding: false,
        type: 'begin',
        firstNodeId: '',
      };
      this.props.handleAddLineChange(state);
    }
  }

  handleClick(e: any) {
    setTimeout(() => {
      if (e._type !== 'node:click') {
        // 重新初始化
        let state = {
          isPedding: false,
          type: 'begin',
          firstNodeId: '',
        };
        this.props.handleAddLineChange(state);
      }
    }, 0);
  }

  handleBeforeCommandExecute(event: any) {
    console.warn('当前操作（before）', event);

    if (event.command.name === 'add' && event.command.type === 'edge') {
      if (this.updateContent) {
        console.warn('当前操作（before）', event);
        // 禁止重复连线
        this.updateContent.checkDupLine(event.command.addModel);
      }
    }
    if (event.command.name === 'add' && event.command.type === 'node') {
      if (this.updateContent) {
        console.warn('当前操作（before）', event);
        // 禁止多个开始/结束节点
        this.updateContent.checkDupStartEnd(event.command.addModel);
      }
    }
  }

  handleAfterCommandExecute(event: any) {
    console.warn('当前操作（after）', event);
    if (this.updateContent) {
      // this.updateContent.testJson2xml();
    }
    if (event.command.name === 'add' && event.command.type === 'node') {
      console.warn('拖动添加节点测试', event.command.addModel);
      if (this.updateContent) {
        // onAfterCommandExecute：在画布渲染完毕之后，再做该操作
        this.updateContent.setMaxFlowIndex();
        this.updateContent.modifyDropNode(event.command.addModel);
      }
    }
    if (event.command.name === 'add' && event.command.type === 'edge') {
      console.warn('拖动添加节点测试', JSON.stringify(event.command.addModel));
      if (this.updateContent) {
        this.updateContent.modifyAddLine(event.command.addModel);
      }
    }
    if (event.command.name === 'delete') {
      console.warn('当前操作（after）', event, event.command.itemIds);
      if (this.updateContent) {
        this.updateContent.modifyDelete(event.command.itemIds, event.command.snapShot);
      }
    }
  }

  handleKeyDown(e: any) {
    if (e.domEvent.shiftKey && e.domEvent.ctrlKey && e.domEvent.keyCode === 90) {
      // console.warn('监控到回撤按钮', this.updateContent)
      if (this.updateContent) {
        // 禁止回撤
        this.updateContent.watchRedoEvent();
      }
    } else if (e.domEvent.ctrlKey && e.domEvent.keyCode === 90) {
      // console.warn('监控到撤销按钮', this.updateContent)
      if (this.updateContent) {
        // 禁止撤销
        this.updateContent.watchUndoEvent();
      }
    }
  }

  renderPendingDot = (processNode) => {
    if (processNode.endTime === undefined) {
      return (
        <div>
          <h4>
            <strong>{processNode.title}</strong>
          </h4>
          <p>{processNode.startTime}</p>
        </div>
      );
    }
    return null;
  };

  changeSlider = () => {
    if (this.state.sliderSpan !== 7) {
      this.setState({
        sliderSpan: 7,
      });
    } else {
      this.setState({
        sliderSpan: 3,
      });
    }
  };

  render() {
    return (
      // <PageContainer
      //   // content={formatMessage({
      //   //   // id: 'editorflow.description',
      //   //   defaultMessage: '',
      //   // })}
      // >
      <GGEditor
        className={styles.editor}
        onBeforeCommandExecute={(event: any) => {
          this.handleBeforeCommandExecute(event);
        }}
        onAfterCommandExecute={(event: any) => {
          this.handleAfterCommandExecute(event);
        }}
      >
        <Row>
          <Col span={24}>
            <UpdateContent onRef={(c) => (this.updateContent = c)} />
          </Col>
        </Row>
        <Row className={styles.editorBd}>
          <Col span={this.state.sliderSpan} className={styles.editorSidebar}>
            <FlowItemPanel onChangeSlider={this.changeSlider} />
          </Col>
          <Col span={20 - this.state.sliderSpan} className={styles.editorContent}>
            <Row className={styles.editorHd}>
              <Col>
                <FlowToolbar />
              </Col>
            </Row>
            <Flow
              className={styles.flow}
              // data={mockFlowData}
              noEndEdge={false}
              graph={{ edgeDefaultShape: 'flow-polyline-round' }}
              onNodeClick={(e: any) => {
                this.handleNodeSelect(e);
              }}
              onClick={(e) => {
                this.handleClick(e);
              }} // 点击画布
              onEdgeClick={(e) => {
                this.handleClick(e);
              }} // 点击边线
              onGroupClick={(e) => {
                this.handleClick(e);
              }} // 点击群组
              onGuideClick={(e) => {
                this.handleClick(e);
              }} // 点击导引
              onAnchorClick={(e) => {
                this.handleClick(e);
              }} // 点击锚点
              onKeyDown={(event) => {
                this.handleKeyDown(event);
              }}
              // onKeyUp={this.handleKeyUp}
            />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <Tabs
              className={styles.tab_main}
              type="card"
              centered
              activeKey={this.props.tabsActive}
              onTabClick={(params) => this.props.modifyTabsActive(params)}
            >
              <TabPane tab="参数设置" key="paramsInput">
                <FlowDetailPanel />
              </TabPane>
              <TabPane tab="执行详情" key="taskInfo" disabled={true}>
                {this.props.processList.data.length > 0 && (
                  <div style={{ padding: 12, height: 780, overflow: 'auto', overflowX: 'hidden' }}>
                    <Timeline
                      pending={this.renderPendingDot(
                        this.props.processList.data[this.props.processList.data.length - 1],
                      )}
                    >
                      {this.props.processList.data.map((item, index) => {
                        if (item.endTime !== undefined) {
                          return (
                            <Timeline.Item color="green" key={index} style={{ paddingBottom: 12 }}>
                              <h4>
                                <strong>{item.title}</strong>
                              </h4>
                              {(item.state === undefined || item.state !== 'end') && (
                                <p>{item.startTime}</p>
                              )}
                              {(item.state === undefined || item.state !== 'start') && (
                                <p>{item.endTime}</p>
                              )}
                            </Timeline.Item>
                          );
                        } else return null;
                      })}
                    </Timeline>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
      // </PageContainer>
    );
  }
}

export default FlowTest;
// export default withPropsAPI(FlowTest);
// export default () => (
//   <PageContainer
//     // content={formatMessage({
//     //   // id: 'editorflow.description',
//     //   defaultMessage: '',
//     // })}
//   >
//     <GGEditor className={styles.editor}>
//       {/* <Row className={styles.editorHd}>
//         <Col span={24}>
//           <FlowToolbar />
//         </Col>
//       </Row> */}
//       <Row className={styles.editorBd}>
//         <Col span={4} className={styles.editorSidebar}>
//           <FlowItemPanel />
//         </Col>
//         <Col span={16} className={styles.editorContent}>
//           <Row className={styles.editorHd}>
//             <Col>
//               <FlowToolbar />
//             </Col>
//           </Row>
//           <Flow className={styles.flow} data={mockFlowData} onNodeClick={(e) => {selectNode()}}/>
//         </Col>
//         <Col span={4} className={styles.editorSidebar}>
//           <Tabs type="card" centered >
//             <TabPane tab="参数设置" key="1">
//               <FlowDetailPanel />
//             </TabPane>
//             <TabPane tab="执行详情" key="2">
//               Content of Tab Pane 2
//               Content of Tab Pane 2
//             </TabPane>
//           </Tabs>
//           {/* <FlowDetailPanel /> */}
//           {/* <EditorMinimap /> */}
//         </Col>
//       </Row>
//       <FlowContextMenu />
//     </GGEditor>
//   </PageContainer>
// );
