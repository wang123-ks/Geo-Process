import React from 'react';
// import { connect } from 'dva';
import { Button, Modal, Form, Input, Tooltip, message, Dropdown, Menu } from 'antd';
import { ConsoleSqlOutlined, SaveOutlined, SaveTwoTone } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import CollectionCreateForm from './CollectionCreateForm';
import styles from './index.less';

// import xml2js from 'xml2js';
import { Json2XML, XML2Json } from '@/pages/EditorFlow/util/XmlToJs';

import { saveAs } from 'file-saver';
import axios from 'axios';

import NodeTypeList from '@/pages/EditorFlow/util/FlowNodeType';

message.config({
  top: 15,
  duration: 4,
});

class Save extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      saveTitle: '流程保存',
      uploadUrl: '',
    };
  }

  componentDidMount() {
    this.getUploadUrl();
  }

  getUploadUrl() {
    const vm = this;
    axios('./config/serverConfig.json')
      .then((res) => {
        // console.warn('结果', res)
        let uploadUrl = res.data.uploadXmlUrl;
        vm.setState({
          uploadUrl: uploadUrl,
        });
      })
      .catch((err) => {
        console.warn('错误', err);
      });
  }

  handleSaveLocal = () => {
    let flag = this.handleSaveVerify();
    if (flag) {
      this.setState({ saveTitle: '保存至本地' });
      this.showModal();
    } else {
      message.warning('存在未填写完成的节点，不可保存');
      message.warning('请依次补充当前高亮的若干节点');
    }
  };

  handleSaveServer = () => {
    let flag = this.handleSaveVerify();
    if (flag) {
      this.setState({ saveTitle: '保存至igserver' });
      this.showModal();
    } else {
      message.warning('存在未填写完成的节点，不可保存');
      message.warning('请依次补充当前高亮的若干节点');
    }
  };

  showModal() {
    this.setState({ modalVisible: true });
  }

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleSaveVerify() {
    let result = true;

    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();

    propsAPI.currentPage.clearSelected();

    if (curFlowData.nodes && curFlowData.nodes.length > 0) {
      curFlowData.nodes.forEach((node) => {
        if (node.NodeType === NodeTypeList.OBJECT) {
          // 选择非创建的话，则验证某一项
          if (node.xattrs.FuntionObjSourceType !== 'CreateNew' && !node.xattrs.PreviousNode) {
            this.selectErrNode(node.id);
            result = false;
          }
        } else if (node.NodeType === NodeTypeList.INPUT) {
          // 选择任何一种，都要做些验证
          switch (node.xattrs.SourceType) {
            case 'Constant':
              if (!node.xattrs.DataSource) {
                this.selectErrNode(node.id);
                result = false;
              }
              break;
            // case "ProcessPara":
            // case "FLSNULL":
            //     break
            case 'PreviousCallInputParamater':
            case 'PreviousCallReturnValue':
            case 'PreviousObject':
              if (!node.xattrs.PreviousNode) {
                this.selectErrNode(node.id);
                result = false;
              }
              break;
          }
        }
      });
    }
    return result;
  }

  selectErrNode(nodeId) {
    const { propsAPI } = this.props;

    const node = propsAPI.find(nodeId);
    propsAPI.currentPage.setSelected(node, true);
  }

  getFinallyXml = (flow, formData, processParaList) => {
    let createdTime = new Date().toLocaleDateString();
    let ActivityNodeList = [];
    if (flow.nodes && flow.nodes.length > 0) {
      flow.nodes.forEach((item) => {
        if (
          item.NodeType &&
          (item.NodeType === NodeTypeList.START || item.NodeType === NodeTypeList.END)
        ) {
          let activity = {
            $: {
              Id: item.FlowIndex,
              Name: item.label,
              Type: item.NodeType,
            },
            Description: '',
            Implementation: '',
            Icon: {
              Icon1: '',
              Icon2: '',
            },
            Performer: '',
            ExtendedAttributes: {
              ExtendedAttribute: [
                {
                  $: {
                    Name: 'xpos',
                    Value: item.x.toString(),
                  },
                },
                {
                  $: {
                    Name: 'ypos',
                    Value: (-item.y).toString(),
                  },
                },
                {
                  $: {
                    Name: '显示颜色',
                    Value: '0',
                  },
                },
                {
                  $: {
                    Name: '显示高度',
                    Value: '0.000000',
                  },
                },
                {
                  $: {
                    Name: '显示宽度',
                    Value: '0.000000',
                  },
                },
                {
                  $: {
                    Name: '字体高度',
                    Value: '0.000000',
                  },
                },
                {
                  $: {
                    Name: '字体宽度',
                    Value: '0.000000',
                  },
                },
                {
                  $: {
                    Name: '序号',
                    Value: '0',
                  },
                },
              ],
            },
          };
          ActivityNodeList.push(activity);
        }
      });
    }
    if (flow.groups && flow.nodes && flow.groups.length > 0 && flow.nodes.length > 0) {
      flow.groups.forEach((group) => {
        let activity = {
          $: {
            Id: group.FlowIndex,
            Name: group.label,
            Type: 'TOOL',
          },
          Description: '',
          Implementation: {
            TOOL: {
              $: {
                Id: '',
                Name: '',
                Type: 'FUNLIB',
                FuntionObjSourceType: '',
                ObjSourceActID: '',
                Priority: '1',
              },
              ActualParameters: {
                ActualParameter: [],
              },
            },
          },
          Icon: {
            Icon1: '',
            Icon2: '',
          },
          Performer: '',
          ExtendedAttributes: {
            ExtendedAttribute: [
              {
                $: {
                  Name: 'xpos',
                  Value: '',
                },
              },
              {
                $: {
                  Name: 'ypos',
                  Value: '',
                },
              },
              {
                $: {
                  Name: '显示颜色',
                  Value: '0',
                },
              },
              {
                $: {
                  Name: '显示高度',
                  Value: '0.000000',
                },
              },
              {
                $: {
                  Name: '显示宽度',
                  Value: '0.000000',
                },
              },
              {
                $: {
                  Name: '字体高度',
                  Value: '0.000000',
                },
              },
              {
                $: {
                  Name: '字体宽度',
                  Value: '0.000000',
                },
              },
              {
                $: {
                  Name: '序号',
                  Value: '0',
                },
              },
            ],
          },
        };
        flow.nodes.forEach((item) => {
          if (group.FlowIndex === item.FlowIndex) {
            switch (item.NodeType) {
              case NodeTypeList.METHOD:
                activity.Implementation.TOOL.$.Id = item.xattrs.functionId || '';
                activity.Implementation.TOOL.$.Name = item.xattrs.functionName || '';
                activity.ExtendedAttributes.ExtendedAttribute[0].$.Value = item.x.toString();
                activity.ExtendedAttributes.ExtendedAttribute[1].$.Value = (-item.y).toString();
                break;
              case NodeTypeList.OBJECT:
                activity.Implementation.TOOL.$.FuntionObjSourceType =
                  item.xattrs.FuntionObjSourceType || '';
                activity.Implementation.TOOL.$.ObjSourceActID = item.xattrs.PreviousNode || '0';
                break;
              case NodeTypeList.INPUT:
                let DataSource;
                switch (item.xattrs.SourceType) {
                  case 'Constant':
                  case 'ProcessPara':
                    DataSource = item.xattrs.DataSource;
                    break;
                  case 'FLSNULL':
                    DataSource = '';
                    break;
                  case 'PreviousCallInputParamater':
                  case 'PreviousCallReturnValue':
                  case 'PreviousObject':
                    DataSource = item.xattrs.PreviousNode;
                    break;
                }
                let parameterIn = {
                  $: {
                    Index: item.ParamIndex,
                    Name: item.xattrs.name,
                    DataType: item.xattrs.type,
                    Direction: item.xattrs.direction.toUpperCase(),
                    SourceType: item.xattrs.SourceType,
                    DataSource: DataSource,
                  },
                };
                activity.Implementation.TOOL.ActualParameters.ActualParameter.push(parameterIn);
                break;
              case NodeTypeList.OUTPUT:
                let parameterOut = {
                  $: {
                    Index: item.OutParamIndex,
                    Name: item.xattrs.name,
                    DataType: item.xattrs.type,
                    Direction: item.xattrs.direction.toUpperCase(),
                    SourceType: item.xattrs.SourceType,
                    DataSource: item.xattrs.DataSource,
                  },
                };
                activity.Implementation.TOOL.ActualParameters.ActualParameter.push(parameterOut);
                break;
            }
          }
        });
        ActivityNodeList.push(activity);
      });
    }

    let TransitionlList = [];
    if (flow.edges && flow.edges.length > 0) {
      flow.edges.forEach((line, index) => {
        if (line.From && line.To) {
          let transitionLine = {
            $: {
              Id: index + 1,
              From: line.From,
              To: line.To,
              Type: '0',
              Condition: '',
            },
            ExtendedAttributes: {
              ExtendedAttribute: [
                {
                  $: {
                    Name: 'dat',
                    Value: '3iHFAAnpbsDTLxFvnWclwERN9PkoVVjAdZFCWfhyPsA=',
                  },
                },
                {
                  $: {
                    Name: '备注',
                    Value: '',
                  },
                },
              ],
            },
          };
          TransitionlList.push(transitionLine);
        }
      });
    }

    let result = {
      WorkFlowProcesses: {
        WorkFlowProcess: {
          $: {
            Id: formData.Description,
            Name: formData.Name,
            Type: 'OSFLOW',
            AcessLevel: 'PRIVATE',
          },
          ProcessHeader: {
            Version: '',
            Creator: formData.Creator || '',
            Created: createdTime,
            SystemBelong: 'Web保存测试',
            Description: formData.Description || '',
          },
          FormalParameters: {
            FormalParameter: processParaList,
          },
          DataFields: '',
          Participants: '',
          Activities: {
            Activitie: ActivityNodeList,
          },
          Transitions: {
            Transition: TransitionlList,
          },
        },
      },
    };
    let resultXml = Json2XML(result);
    return resultXml;
  };

  handleSubmit = (formData) => {
    const { propsAPI } = this.props;
    const vm = this;
    const flowData = propsAPI.save();
    // console.warn('拿到我的模板', flowData, JSON.stringify(flowData));
    console.warn('拿到流程图模板', flowData);
    // console.warn('拿到表单输入', formData);

    // 保存前先收集所有全局参数列表
    let processParaList = this.getProcessParaList(flowData);

    // 获取转换后的xml
    const newFlowData = propsAPI.save();
    let finalXml = this.getFinallyXml(newFlowData, formData, processParaList);
    console.warn('发请求保存的内容', finalXml);

    // let xml1 = '<WorkFlowProcesses><WorkFlowProcess Id="600370" Name="ws测试（工具搭建）-修改" Type="OSFLOW" AcessLevel="PRIVATE"><ProcessHeader><Version></Version><Creator>王魁帅</Creator><Created>2021-12-23</Created><SystemBelong>测试</SystemBelong><Description></Description></ProcessHeader><FormalParameters><FormalParameter Index="1" Name="参数url" DataType="STRING" Direction="IN" DefaultValue="" pageElement="&lt;pageElement type=&quot;TextBox&quot; maxlength=&quot;&quot; readonly=&quot;False&quot; tooltip=&quot;&quot; required=&quot;True&quot; multivalue=&quot;False&quot; autofill=&quot;False&quot; /&gt;"/></FormalParameters><DataFields/><Participants/><Activities><Activitie Id="3" Name="取类URL" Type="TOOL"><Description></Description><Implementation><Tool Id="2E1134BD2C7BC534BFE7A3CC4603468D" Name="getURL" Type="FUNLIB" FuntionObjSourceType="PreviousCallCreateObject" ObjSourceActID="8" Priority="1"><ActualParameters><ActualParameter Index="1" Name="return" DataType="String" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="145.625287"/><ExtendedAttribute Name="ypos" Value="-90.419580"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="9" Name="取类名称" Type="TOOL"><Description></Description><Implementation><Tool Id="4C0763FEBC4C486B1AF5FA49AA1D0D5C" Name="getName" Type="FUNLIB" FuntionObjSourceType="PreviousCallCreateObject" ObjSourceActID="8" Priority="1"><ActualParameters><ActualParameter Index="1" Name="return" DataType="String" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="177.949906"/><ExtendedAttribute Name="ypos" Value="75.377186"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="8" Name="url打开" Type="TOOL"><Description></Description><Implementation><Tool Id="034331D204A0C54C2C52B5A97C35D88F" Name="openByURL" Type="FUNLIB" FuntionObjSourceType="CreateNew" ObjSourceActID="0" Priority="1"><ActualParameters><ActualParameter Index="1" Name="url" DataType="String" Direction="IN" SourceType="ProcessPara" DataSource="1"/><ActualParameter Index="2" Name="return" DataType="long" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-137.605146"/><ExtendedAttribute Name="ypos" Value="84.039481"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="6" Name="结束节点" Type="END"><Description></Description><Implementation/><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-183.704785"/><ExtendedAttribute Name="ypos" Value="-204.388835"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="6"/></ExtendedAttributes></Activitie><Activitie Id="7" Name="开始节点" Type="START"><Description></Description><Implementation/><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-356.958418"/><ExtendedAttribute Name="ypos" Value="81.137517"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="7"/></ExtendedAttributes></Activitie></Activities><Transitions><Transition Id="1" From="9" To="3" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="xohEoWU+ZkCUoL/QI9hSQKXz4VkCNGJAkIMSZtqaVsA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="2" From="3" To="6" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="pfPhWQI0YkCQgxJm2ppWwMO2RZmN9mbASREZVnGMacA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="3" From="7" To="8" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="Xd4crlVPdsA4aRoUzUhUQMTpJFtdM2HADvRQ24YCVUA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="4" From="8" To="9" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="xOkkW10zYcAO9FDbhgJVQMaIRKFlPmZAlKC/0CPYUkA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition></Transitions></WorkFlowProcess></WorkFlowProcesses>'
    // let myJson = XML2Json(xml1)
    // console.warn('暂时json转字符串', JSON.stringify(myJson));
    // let fakeXml = Json2XML(myJson)

    // 方式1：通过<a>模拟触发下载保存到本地
    // this.handleSaveXml(finalXml, 'myFlow.xml', 'text/xml')
    // 方式2：通过file-saver的saveAs保存到本地
    const blob = new Blob([finalXml], { type: 'text/xml' });
    saveAs(blob, 'myFlow.xml');

    this.setState({ modalVisible: false });

    // 保存至igs
    // let uploadUrl = this.state.uploadUrl;

    // let uploadFormData = new FormData();
    // uploadFormData.append('workflowNo', formData.Description);
    // uploadFormData.append('aliasName', formData.Name);
    // uploadFormData.append('templateContent', finalXml);
    // axios
    //   .post(uploadUrl, uploadFormData)
    //   .then((response) => {
    //     console.warn('上传', response);
    //     if (response.status === 200) {
    //       if (response.data.code > 0) {
    //         message.success('保存成功');
    //         vm.setState({ modalVisible: false });
    //       } else {
    //         message.error(response.data.msg || 'xml格式有误？');
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     console.error('错误', err);
    //   });
  };

  getProcessParaList(flow) {
    const { propsAPI } = this.props;

    let processParaIndex = 1;
    let result = [];
    if (flow.nodes && flow.nodes.length > 0) {
      flow.nodes.forEach((item) => {
        if (
          item.NodeType &&
          item.NodeType === NodeTypeList.INPUT &&
          item.xattrs.SourceType === 'ProcessPara'
        ) {
          let processParaCurIndex = processParaIndex++;
          let processPara = {
            $: {
              Index: processParaCurIndex,
              Name: item.xattrs.ProcessParaInfo.Name,
              DataType: item.xattrs.ProcessParaInfo.DataType,
              Direction: item.xattrs.ProcessParaInfo.Direction,
              DefaultValue: item.xattrs.ProcessParaInfo.DefaultValue,
              pageElement: '',
            },
          };
          result.push(processPara);
          let newItem = item;
          newItem.xattrs.DataSource = processParaCurIndex;
          propsAPI.update(newItem.id, newItem);
        }
      });
    }
    return result;
  }

  handleSaveXml(text, name, type) {
    let myA = document.getElementById('a');
    let file = new Blob([text], { type: type });
    myA.href = URL.createObjectURL(file);
    myA.download = name;
    myA.dispatchEvent(
      new MouseEvent('click', {
        bubbles: false,
        cancelable: false,
      }),
    );
  }

  render() {
    const { isSubmitting = false } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.handleSaveLocal}>
            保存至本地
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.handleSaveServer}>
            保存至IGServer
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        {/* <Tooltip
                    title='保存'
                    placement="bottom"
                    overlayClassName={styles.tooltip}
                >
                    <div onClick={this.handleSaveLocal} style={{ ['marginLeft']: 16}}>
                        <SaveOutlined style={{ 'cursor': 'pointer'}}/>
                    </div>
                </Tooltip> */}
        <Dropdown overlay={menu} placement="bottomCenter" arrow trigger={['click']}>
          <Tooltip title="保存" placement="bottom" overlayClassName={styles.tooltip}>
            <div style={{ ['marginLeft']: 10 }}>
              <SaveTwoTone style={{ cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </Dropdown>

        <CollectionCreateForm
          visible={this.state.modalVisible}
          title={this.state.saveTitle}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          isSubmitting={isSubmitting}
        />
        <a href="" id="a"></a>
      </div>
    );
  }
}

export default withPropsAPI(Save);
