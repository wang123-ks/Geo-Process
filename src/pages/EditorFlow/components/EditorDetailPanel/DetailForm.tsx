import React from 'react';
import { Card, Input, Select, Form } from 'antd';
import { TagsTwoTone } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import { connect } from 'dva';
import { render } from 'react-dom';
import styles from './index.less';

import { StyleModal } from 'clouddisk-select-layer-flow/dist/lib/vuerademo.js'; // 引用的vue组件，需要先link

const { Search } = Input;

// const upperFirst = (str: string) =>
//   str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
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
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

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
        <Item label="分组名称" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  renderCardTitle = () => {
    // console.warn('当前item', this.item.getModel())
    // const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    const { label = '新建分组' } = this.item.getModel();
    console.warn('当前item', this.item.getModel());
    return (
      <span>
        {/* <TagsTwoTone /> */}
        <TagsTwoTone />
        <span style={{ ['paddingLeft']: 5 }}>{label}</span>
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
    const key = this.item.getModel().key_a;
    // const { key } = this.item.getModel();
    if (!this.item) {
      return null;
    }

    return (
      <div className={styles.card_main}>
        <Card type="inner" size="small" title={this.renderCardTitle()} bordered={false}>
          <div style={{ height: 570, overflow: 'auto', overflowX: 'hidden' }}>
            {/* {type === 'node' && this.renderNodeDetail()} */}
            {/* {type === 'edge' && this.renderEdgeDetail()} */}
            {type === 'group' && this.renderGroupDetail()}
            {this.props.paramsList.isShow &&
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
              })}
            {/* {!this.props.paramsList.isShow || !this.props.paramsList.data[key] && type !== 'group' && 
              <p>暂无参数</p>
            } */}
          </div>
        </Card>
        <StyleModal
          showStyleModal={this.state.showStyleModal}
          onlyFolder={this.state.onlyFolder}
          handleClose={this.handleClose}
          handleNewDocument={(e) => {
            this.props.handleInputChange(key, this.state.currentParam, e.url);
          }} // 参数为载荷形式
        />
        {/* <this.RenderParams/> */}
      </div>
    );
  }
}

export default withPropsAPI(DetailForm as any);
