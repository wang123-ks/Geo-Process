import { Col, Row, Tabs, Timeline } from 'antd';
import GGEditor, { Flow } from 'gg-editor';

import { connect } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
// import { formatMessage } from 'umi';
import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import mockFlowData from './FlowData/mockFlowData';
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
  return {
    paramsList,
    processList,
    tabsActive,
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
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class FlowTest extends React.Component {
  constructor(props) {
    super(props);
  }

  // selectNode = (e) => {
  //   console.warn('选择节点', e.item.model)
  // };
  handleNodeSelect(e) {
    console.warn('单选', e);
    // let needInput = e.item.model
    this.props.changeShow(false);
    this.props.selectNode(e);
    this.props.modifyTabsActive('paramsInput');
    // console.warn('这是', this.props.processList);
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

  render() {
    return (
      // <PageContainer
      //   // content={formatMessage({
      //   //   // id: 'editorflow.description',
      //   //   defaultMessage: '',
      //   // })}
      // >
      <GGEditor className={styles.editor}>
        {/* <Row className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar />
            </Col>
          </Row> */}
        <Row className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <FlowItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <Row className={styles.editorHd}>
              <Col>
                <FlowToolbar />
              </Col>
            </Row>
            <Flow
              className={styles.flow}
              data={mockFlowData}
              onNodeClick={(e) => {
                this.handleNodeSelect(e);
              }}
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
              <TabPane tab="执行详情" key="taskInfo">
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
