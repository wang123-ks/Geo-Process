import React from 'react';
import { Card, Input, Select, Form, Divider } from 'antd';
import { TagsTwoTone } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import { connect } from 'dva';
import { render } from 'react-dom';
import styles from './index.less';

// import { StyleModal } from 'clouddisk-select-layer-flow/dist/lib/vuerademo.js'; // 引用的vue组件，需要先link
import NodeTypeList from '@/pages/EditorFlow/util/FlowNodeType';

const { Search } = Input;

// const upperFirst = (str: string) =>
//   str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  // labelCol: {
  //   sm: { span: 12 },
  // },
  // wrapperCol: {
  //   sm: { span: 12 },
  // },
};
const onSearch = (value) => console.warn(value);

const namespace1 = 'paramsList';
const namespace2 = 'paramsInput';

const mapStateToProps = (state: any) => {
  const paramsList = state[namespace1];
  const paramsInput = state[namespace2];
  // console.warn('拿到第几次了', paramsList)
  return {
    paramsList,
    paramsInput,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (key, name, value) => {
      let newParams = {
        key,
        name,
        value,
      };
      const action = {
        type: `${namespace2}/changeParamsInput`,
        payload: newParams,
      };
      dispatch(action);
    },
  };
};

type DetailFormProps = {
  type: string;
  propsAPI?: any;
};

type DetailFormState = {
  showStyleModal: boolean;
  onlyFolder: boolean;
  currentParam: string;
};

@connect(mapStateToProps, mapDispatchToProps)
class DetailForm extends React.Component<DetailFormProps, DetailFormState> {
  constructor(props) {
    super(props);
    if (props.onRef) {
      //如果父组件传来该方法 则调用方法将子组件this指针传过去
      props.onRef(this);
    }
  }

  public state: DetailFormState = {
    showStyleModal: false, // 需要传给vue组件的值，控制对话框的打开与否
    onlyFolder: false,
    currentParam: '',
  };

  get item() {
    const { propsAPI } = this.props;
    // console.warn('追踪选中', propsAPI.getSelected())
    return propsAPI.getSelected()[0];
  }

  handleClose = () => {
    // 需要传给vue组件的函数，用来控制对话框的关闭
    this.setState({
      showStyleModal: false,
    });
  };

  handleNewDocument = (doc) => {
    console.warn('打印最新版doc', doc);
  };

  handleFieldChange = (values: any) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      console.warn('打印item', item);
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
      this.forceUpdate();
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  handleXattrsInputBlur = (type: string, xattrs: object) => (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    this.handleFieldChange({
      xattrs: {
        ...xattrs,
        ...{ [type]: e.currentTarget.value },
      },
    });
  };

  handleProcessParaInfoInputBlur = (type: string, xattrs: object) => (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    let newXattrs = xattrs;
    newXattrs.ProcessParaInfo[type] = e.currentTarget.value;
    this.handleFieldChange({
      xattrs: newXattrs,
    });
  };

  handleProcessParaInfoSelect = (type: string, xattrs: object) => (value: any) => {
    // e.preventDefault();
    let newXattrs = xattrs;
    newXattrs.ProcessParaInfo[type] = value;
    this.handleFieldChange({
      xattrs: newXattrs,
    });
  };

  handleSourceTypeChange = (value: any) => {
    const Node = this.item.getModel();
    console.warn('当前节点删除线', Node);

    // 删除线：获取当前flowdata，遍历线，删掉target为本节点的线
    this.deleteOldLine(Node.id);
    // onAfterCommandExecute监控不到上面的删除操作，故这里要自行清除信息
    Node.xattrs.PreviousNode = '';

    // 更新选项信息
    this.handleFieldChange({ xattrs: { ...Node.xattrs, ...{ SourceType: value } } });
  };

  handleObjSourceTypeChange = (value: any) => {
    const Node = this.item.getModel();
    console.warn('当前节点删除线', Node);

    // 删除线：获取当前flowdata，遍历线，删掉target为本节点的线
    this.deleteOldLine(Node.id);
    // onAfterCommandExecute监控不到上面的删除操作，故这里要自行清除信息
    Node.xattrs.PreviousNode = '';

    // 更新选项信息
    this.handleFieldChange({ xattrs: { ...Node.xattrs, ...{ FuntionObjSourceType: value } } });
  };

  deleteOldLine(id) {
    const { propsAPI } = this.props;

    const curFlowData = propsAPI.save();
    curFlowData.edges.forEach((edge) => {
      if (edge.target === id && !edge.systemCreate) {
        // 找到线后，先减去group的isUsedCount、useOtherCount计数
        const sourceNode = propsAPI.find(edge.source);
        const targetNode = propsAPI.find(edge.target);
        if (curFlowData.groups && curFlowData.groups.length > 0) {
          curFlowData.groups.forEach((group) => {
            if (group.FlowIndex === sourceNode.model.FlowIndex) {
              let newGroup = group;
              newGroup.isUsedCount -= 1;
              propsAPI.update(group.id, newGroup);
            } else if (group.FlowIndex === targetNode.model.FlowIndex) {
              let newGroup = group;
              newGroup.useOtherCount -= 1;
              propsAPI.update(group.id, newGroup);
            }
          });
        }

        // 再删除线
        propsAPI.remove(edge.id);
      }
    });
  }

  // handleInputChange = (name, e) => {

  //   console.warn('输入', e.target.value);
  // };

  renderNodeDetail = () => {
    let nodeInfo = this.item.getModel();
    const { label } = this.item.getModel();
    console.warn('输出node信息', nodeInfo);
    return (
      <Form initialValues={{ label }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Form initialValues={{ label, shape }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
        <Item label="Shape" name="shape" {...inlineFormItemLayout}>
          <Select onChange={(value) => this.handleFieldChange({ shape: value })}>
            <Option value="flow-smooth">Smooth</Option>
            <Option value="flow-polyline">Polyline</Option>
            <Option value="flow-polyline-round">Polyline Round</Option>
          </Select>
        </Item>
      </Form>
    );
  };

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="流程名称" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  renderObjecySet = () => {
    const Node = this.item.getModel();
    const FuntionObjSourceType = Node.xattrs.FuntionObjSourceType || '';
    return (
      <Form initialValues={{ FuntionObjSourceType }} layout="vertical">
        <Item label="功能对象来源方式：" name="FuntionObjSourceType" {...inlineFormItemLayout}>
          {/* <Select onChange={(value) => this.handleFieldChange({ xattrs:{ ...Node.xattrs, ...{FuntionObjSourceType: value}}})}> */}
          <Select onChange={(value) => this.handleObjSourceTypeChange(value)}>
            <Option value="Default">默认方式</Option>
            <Option value="CreateNew">新创建对象</Option>
            <Option value="PreviousCallCreateObject">指定前流程创建的对象</Option>
            <Option value="PreviousCallReturnObject">指定前流程的返回值对象</Option>
          </Select>
        </Item>
        {FuntionObjSourceType === 'PreviousCallCreateObject' && (
          <div>
            <Divider />
            <p>需要通过连线指定前流程创建的对象（小圆圈）</p>
          </div>
        )}
        {FuntionObjSourceType === 'PreviousCallReturnObject' && (
          <div>
            <Divider />
            <p>需要通过连线指定前流程的返回值</p>
          </div>
        )}
      </Form>
    );
  };

  renderInputSet = () => {
    const Node = this.item.getModel();
    const SourceType = Node.xattrs.SourceType || '';
    const DataSource = Node.xattrs.DataSource || '';
    const { Name, DataType, Direction, DefaultValue } = Node.xattrs.ProcessParaInfo;
    // const PreviousNode = Node.xattrs.PreviousNode

    return (
      <Form
        initialValues={{ SourceType, DataSource, Name, DataType, Direction, DefaultValue }}
        layout="vertical"
      >
        <Item label="参数来源方式：" name="SourceType" {...inlineFormItemLayout}>
          {/* <Select onChange={(value) => this.handleFieldChange({ xattrs:{ ...Node.xattrs, ...{SourceType: value}}})}> */}
          <Select onChange={(value) => this.handleSourceTypeChange(value)}>
            <Option value="Constant">常量</Option>
            <Option value="FLSNULL">空值</Option>
            <Option value="ProcessPara">全局参数</Option>
            <Option value="PreviousCallInputParamater">指定前流程的输入参数</Option>
            <Option value="PreviousCallReturnValue">指定前流程的返回值</Option>
            <Option value="PreviousObject">指定前流程创建的对象</Option>
          </Select>
        </Item>
        {SourceType === 'PreviousCallInputParamater' && (
          <div>
            <Divider />
            <p>需要通过连线指定前流程的输入参数</p>
          </div>
        )}
        {SourceType === 'PreviousCallReturnValue' && (
          <div>
            <Divider />
            <p>需要通过连线指定前流程的返回值</p>
          </div>
        )}
        {SourceType === 'PreviousObject' && (
          <div>
            <Divider />
            <p>需要通过连线指定前流程创建的对象（小圆圈）</p>
          </div>
        )}
        {SourceType === 'Constant' && (
          <div>
            <Divider />
            <Item label="参数值（建议填写）：" name="DataSource" {...inlineFormItemLayout}>
              <Input onBlur={this.handleXattrsInputBlur('DataSource', Node.xattrs)} />
            </Item>
          </div>
        )}
        {SourceType === 'ProcessPara' && (
          <div>
            <Divider />
            <Item label="名称：" name="Name" {...inlineFormItemLayout}>
              <Input onBlur={this.handleProcessParaInfoInputBlur('Name', Node.xattrs)} />
            </Item>
            <Item label="类型：" name="DataType" {...inlineFormItemLayout}>
              <Select onChange={this.handleProcessParaInfoSelect('DataType', Node.xattrs)}>
                <Option value="STRING">String</Option>
                <Option value="INT">Int</Option>
                <Option value="FLOAT">Float</Option>
                <Option value="BOOL">Bool</Option>
                <Option value="DATE">Date</Option>
                <Option value="DATETIME">Datetime</Option>
              </Select>
            </Item>
            <Item label="方向：" name="Direction" {...inlineFormItemLayout}>
              <Select onChange={this.handleProcessParaInfoSelect('Direction', Node.xattrs)}>
                <Option value="IN">IN</Option>
                <Option value="OUT">OUT</Option>
                <Option value="INOUT">INOUT</Option>
              </Select>
            </Item>
            <Item label="默认值：" name="DefaultValue" {...inlineFormItemLayout}>
              <Input onBlur={this.handleProcessParaInfoInputBlur('DefaultValue', Node.xattrs)} />
            </Item>
          </div>
        )}
      </Form>
    );
  };

  renderCardTitle = () => {
    // console.warn('当前item', this.item.getModel())
    // const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    const { label = '' } = this.item.getModel();
    let title = label;
    let type = '';
    if (this.item.getModel().xattrs && this.item.getModel().xattrs.type) {
      type = this.item.getModel().xattrs.type;
      title = label + '【类型：' + type + '】';
    }
    return (
      <span>
        <TagsTwoTone />
        <span style={{ ['paddingLeft']: 5 }} title={type}>
          {title}
        </span>
      </span>
    );
  };

  RenderParams = () => {
    const { key } = this.item.getModel();
    // console.warn('看有没有paramsList', this.props.paramsList)
    return (
      <div>
        {/* { key === 'select_cd_data' && this.} */}
        {key}
      </div>
    );
  };

  handleSearch = (item) => {
    // console.warn('当前direction', item.direction)
    this.setState({
      currentParam: item.name,
    });
    if (item.direction.indexOf('IN') >= 0) {
      this.setState({
        showStyleModal: true,
        onlyFolder: false,
      });
    } else if (item.direction.indexOf('OUT') >= 0) {
      this.setState({
        showStyleModal: true,
        onlyFolder: true,
      });
    }
  };
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // 不再提供 prevProps 的获取方式
  //   console.warn('看有没有nextProps', nextProps)
  //   console.warn('看有没有prevState', prevState)
  //   // if (nextProps.currentRow !== prevState.lastRow) {
  //   //   return {
  //   //     isScrollingDown: nextProps.currentRow > prevState.lastRow,
  //   //     lastRow: nextProps.currentRow,
  //   //   };
  //   // }

  //   // 默认不改动 state
  //   return nextProps;
  // };
  // shouldComponentUpdate (nextProps) {
  //   console.warn('看这两个一样吗', this.props.paramsList, nextProps.paramsList)
  //   if (this.props.paramsList !== nextProps.paramsList) {
  //     // 检测到变化后更新状态、并请求数据
  //     // this.setState({
  //     //   isScrollingDown: nextProps.currentRow > this.props.currentRow,
  //     // });
  //     // this.loadAsyncData()
  //     return true
  //   }
  //   return false
  // }

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }
    const key = this.item.getModel().key_a;
    // const { key } = this.item.getModel();
    const nodeType = this.item.getModel().NodeType;
    return (
      <div className={styles.card_main}>
        <Card type="inner" size="small" title={this.renderCardTitle()} bordered={false}>
          <div style={{ height: 720, overflow: 'auto', overflowX: 'hidden' }}>
            {/* {type === 'node' && this.renderNodeDetail()} */}
            {/* {type === 'edge' && this.renderEdgeDetail()} */}
            {type === 'group' && this.renderGroupDetail()}
            {/* {nodeType === NodeTypeList.OBJECT && <p>请选择与之相连的流程节点并设置来源方式</p>} */}
            {nodeType === NodeTypeList.OBJECT && this.renderObjecySet()}
            {/* {nodeType === NodeTypeList.METHOD && this.renderMethodSet()} */}
            {nodeType === NodeTypeList.METHOD && <p>请选择与之相连的功能对象节点并设置来源方式</p>}
            {nodeType === NodeTypeList.INPUT && this.renderInputSet()}
            {/* {this.props.paramsList.isShow &&
              key &&
              this.props.paramsList.data[key] &&
              this.props.paramsList.data[key].map((item, index) => {
                return (
                  <div key={index}>
                    {item.need && <span> * </span>}
                    {item.index}、{item.briefDescp}：
                    {item.dataType === 'ENUM' && (
                      <div>
                        <Select
                          value={this.props.paramsInput.data[key][item.name] || ''}
                          style={{ width: 230 }}
                          onChange={(value) => {
                            this.props.handleInputChange(key, item.name, value);
                          }}
                        >
                          {item.defauleValue !== '' &&
                            item.defauleValue.split(',').map((ele, indexA) => {
                              return (
                                <Option key={indexA} value={ele}>
                                  {ele}
                                </Option>
                              );
                            })}
                        </Select>
                      </div>
                    )}
                    {item.dataType === 'GEOMETRY' && (
                      <Search
                        style={{ width: 230 }}
                        value={this.props.paramsInput.data[key][item.name] || ''}
                        onSearch={() => {
                          this.handleSearch(item);
                        }}
                        enterButton
                      />
                    )}
                    {item.dataType !== 'ENUM' && item.dataType !== 'GEOMETRY' && (
                      <Input
                        style={{ width: 230 }}
                        value={this.props.paramsInput.data[key][item.name] || ''}
                        onChange={(e) => {
                          this.props.handleInputChange(key, item.name, e.target.value);
                        }}
                      />
                    )}
                  </div>
                );
              })} */}
            {/* {!this.props.paramsList.isShow || !this.props.paramsList.data[key] && type !== 'group' && 
              <p>暂无参数</p>
            } */}
          </div>
        </Card>
        {/* <StyleModal
          showStyleModal={this.state.showStyleModal}
          onlyFolder={this.state.onlyFolder}
          handleClose={this.handleClose}
          handleNewDocument={(e) => {
            this.props.handleInputChange(key, this.state.currentParam, e.url);
          }} // 参数为载荷形式
        /> */}
        {/* <this.RenderParams/> */}
      </div>
    );
  }
}

export default withPropsAPI(DetailForm as any);
