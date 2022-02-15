import React from 'react';
import { withPropsAPI } from 'gg-editor';
// import xml2js from 'xml2js';
import { Json2XML, XML2Json } from '@/pages/EditorFlow/util/XmlToJs';

import { message } from 'antd';

import NodeTypeList from '@/pages/EditorFlow/util/FlowNodeType';

message.config({
  top: 15,
  duration: 4,
});

const LineRules = {
  START: {
    START: { permission: false, msg: '禁止指向开始节点' },
    END: { permission: false, msg: '禁止开始结束节点之间相连' },
    METHOD: { permission: true, msg: '' },
    INPUT: { permission: false, msg: '开始节点不可与输入节点相连，请连接流程节点' },
    OUTPUT: { permission: false, msg: '开始节点不可与输出节点相连，请连接流程节点' },
    OBJECT: { permission: false, msg: '开始节点不可与对象节点相连，请连接流程节点' },
  },
  END: {
    START: { permission: false, msg: '禁止开始结束节点之间相连' },
    END: { permission: false, msg: '禁止指向结束节点' },
    METHOD: { permission: false, msg: '禁止结束节点指向其他节点' },
    INPUT: { permission: false, msg: '禁止结束节点指向其他节点' },
    OUTPUT: { permission: false, msg: '禁止结束节点指向其他节点' },
    OBJECT: { permission: false, msg: '禁止结束节点指向其他节点' },
  },
  METHOD: {
    START: { permission: false, msg: '禁止指向开始节点' },
    END: { permission: true, msg: '' },
    METHOD: { permission: true, msg: '' },
    INPUT: { permission: false, msg: '流程节点不可与输入节点相连，请连接其他流程节点或结束节点' },
    OUTPUT: {
      permission: false,
      msg: '流程节点不可与其他输出节点相连，请连接其他流程节点或结束节点',
    },
    OBJECT: {
      permission: false,
      msg: '流程节点不可与其他对象节点相连，请连接其他流程节点或结束节点',
    },
  },
  INPUT: {
    START: { permission: false, msg: '禁止指向开始节点' },
    END: { permission: false, msg: '禁止指向结束节点' },
    METHOD: { permission: false, msg: '输入节点不可与其他流程节点相连' },
    INPUT: { permission: true, msg: '', needCheckSourceType: true },
    OUTPUT: { permission: false, msg: '输入节点不可与输出节点相连' },
    OBJECT: { permission: false, msg: '输入节点不可与对象节点相连' },
  },
  OUTPUT: {
    START: { permission: false, msg: '禁止指向开始节点' },
    END: { permission: false, msg: '禁止指向结束节点' },
    METHOD: { permission: false, msg: '输出节点不可与其他流程节点相连' },
    INPUT: { permission: true, msg: '', needCheckSourceType: true },
    OUTPUT: { permission: false, msg: '禁止指向输出节点' },
    OBJECT: { permission: true, msg: '', needCheckSourceType: true },
  },
  OBJECT: {
    START: { permission: false, msg: '禁止指向开始节点' },
    END: { permission: false, msg: '禁止指向结束节点' },
    METHOD: { permission: false, msg: '对象节点不可与其他流程节点相连' },
    INPUT: { permission: true, msg: '', needCheckSourceType: true },
    OUTPUT: { permission: false, msg: '对象节点不可与其他输出节点相连' },
    OBJECT: { permission: true, msg: '', needCheckSourceType: true },
  },
};

class Updata extends React.Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      //如果父组件传来该方法 则调用方法将子组件this指针传过去
      props.onRef(this);
    }
    this.state = {
      indexLog: 0,
    };
  }

  setMaxFlowIndex() {
    const { propsAPI } = this.props;

    let maxIndex = 0;
    const curFlowData = propsAPI.save();
    console.warn('测试12334', curFlowData); // 获取当前项
    if (curFlowData.nodes && curFlowData.nodes.length > 0) {
      curFlowData.nodes.forEach((item) => {
        if (item.FlowIndex > maxIndex) maxIndex = item.FlowIndex;
      });
    }
    this.setState({
      indexLog: maxIndex, // 获取到FlowIndex的最大值
    });
  }

  testJson2xml = () => {
    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();
    console.warn('测试当前Flow项', curFlowData); // 获取当前项

    // let curFlowData1 = {
    //   "WorkFlowProcesses": {
    //     "WorkFlowProcess": {
    //       "$": {
    //         "Id": "",
    //         "Name": "低通滤波123",
    //         "Type": "",
    //         "AcessLevel": "PRIVATE"
    //       },
    //       "ProcessHeader": {
    //         "Version": "",
    //         "Creator": "",
    //         "Created": "2015-1-27",
    //         "SystemBelong": "MapGISToolBox",
    //         "Description": ""
    //       },
    //     }
    //   }
    // }
    // let groups = {
    //   "id": {},
    //   "x": "",
    //   "y": [],
    //   "label": "矢量瓦片裁剪",
    //   "collapsed": false,
    //   "index": 0
    // }
    let myXml = Json2XML(curFlowData);
    console.warn('测试结果xml', myXml);

    let xml1 =
      '<WorkFlowProcesses><WorkFlowProcess Id="5" Name="低通滤波123" Type="OSFLOW" AcessLevel="PRIVATE"><ProcessHeader><Version></Version><Creator></Creator><Created>2015-1-27</Created><SystemBelong>MapGISToolBox</SystemBelong><Description></Description></ProcessHeader><FormalParameters><FormalParameter Index="1" Name="输入文件" DataType="STRING" Direction="IN" DefaultValue="" pageElement="&lt;pageElement type=&quot;MapGISDialog&quot; filter=&quot;MFT文件|*.mft&quot; readonly=&quot;False&quot; tooltip=&quot;&quot; issavedialog=&quot;False&quot; required=&quot;True&quot; multivalue=&quot;False&quot; /&gt;"/><FormalParameter Index="2" Name="输出文件" DataType="STRING" Direction="IN" DefaultValue="" pageElement="&lt;pageElement type=&quot;FileDialog&quot; filter=&quot;MFT文件|*.mft&quot; readonly=&quot;False&quot; tooltip=&quot;&quot; issavedialog=&quot;True&quot; required=&quot;True&quot; multivalue=&quot;False&quot; appendtomap=&quot;False&quot; autofill=&quot;True&quot; autofillattachinput=&quot;输入文件&quot; samerow=&quot;False&quot; /&gt;"/><FormalParameter Index="3" Name="窗口函数" DataType="INT" Direction="IN" DefaultValue="" pageElement="&lt;pageElement type=&quot;ComBox&quot; readonly=&quot;True&quot; tooltip=&quot;&quot; comboboxitems=&quot;Ideal窗口函数&amp;#xFFFE;1&amp;#xFFFE;True&amp;#xFFFF;Bartlett窗口函数&amp;#xFFFE;2&amp;#xFFFE;False&amp;#xFFFF;Butterworth窗口函数&amp;#xFFFE;3&amp;#xFFFE;False&amp;#xFFFF;Gaussian窗口函数&amp;#xFFFE;4&amp;#xFFFE;False&amp;#xFFFF;Hanning窗口函数&amp;#xFFFE;5&amp;#xFFFE;False&quot; required=&quot;True&quot; samerow=&quot;False&quot; /&gt;"/><FormalParameter Index="4" Name="滤波半径" DataType="FLOAT" Direction="IN" DefaultValue="50" pageElement="&lt;pageElement type=&quot;&quot; required=&quot;True&quot; samerow=&quot;False&quot; /&gt;"/><FormalParameter Index="5" Name="低频增益" DataType="FLOAT" Direction="IN" DefaultValue="1" pageElement="&lt;pageElement type=&quot;&quot; required=&quot;True&quot; samerow=&quot;False&quot; /&gt;"/><FormalParameter Index="6" Name="高频增益" DataType="FLOAT" Direction="IN" DefaultValue="0" pageElement="&lt;pageElement type=&quot;&quot; required=&quot;True&quot; samerow=&quot;False&quot; /&gt;"/></FormalParameters><DataFields/><Participants/><Activities><Activitie Id="6" Name="设置参数" Type="TOOL"><Description></Description><Implementation><Tool Id="0753E14F879B67159A54FB219F685437BA7E7221" Name="SetData" Type="FUNLIB" FuntionObjSourceType="Default" ObjSourceActID="0" Priority="1"><ActualParameters><ActualParameter Index="1" Name="Data" DataType="MapGIS.GeoDataBase.GeoRaster.RasterDataS" Direction="IN" SourceType="PreviousObject" DataSource="2"/><ActualParameter Index="2" Name="return" DataType="System.Void" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-96.740900"/><ExtendedAttribute Name="ypos" Value="46.816654"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="3" Name="Close" Type="TOOL"><Description></Description><Implementation><Tool Id="CC035CDC5129ECB87E3185CE249DB4AE021FB4FF" Name="Close" Type="FUNLIB" FuntionObjSourceType="PreviousCallCreateObject" ObjSourceActID="2" Priority="1"><ActualParameters><ActualParameter Index="1" Name="return" DataType="System.Boolean" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="192.699467"/><ExtendedAttribute Name="ypos" Value="23.854399"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="2" Name="打开栅格数据集" Type="TOOL"><Description></Description><Implementation><Tool Id="7992447B831D7AC8940155A9FF11A1632259206E" Name="Open" Type="FUNLIB" FuntionObjSourceType="CreateNew" ObjSourceActID="0" Priority="1"><ActualParameters><ActualParameter Index="1" Name="filePath" DataType="System.String" Direction="IN" SourceType="ProcessPara" DataSource="1"/><ActualParameter Index="2" Name="accType" DataType="MapGIS.GeoDataBase.GeoRaster.RasAccessTy" Direction="IN" SourceType="Constant" DataSource="0"/><ActualParameter Index="3" Name="return" DataType="System.Boolean" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-110.403455"/><ExtendedAttribute Name="ypos" Value="-45.700743"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="1" Name="傅立叶滤波" Type="TOOL"><Description></Description><Implementation><Tool Id="B9CD9C51FC30B89A4470500946AD97639E7C985E" Name="RsFourierFilter" Type="FUNLIB" FuntionObjSourceType="Default" ObjSourceActID="0" Priority="1"><ActualParameters><ActualParameter Index="1" Name="FTtype" DataType="System.Int32" Direction="IN" SourceType="Constant" DataSource="0"/><ActualParameter Index="2" Name="WinType" DataType="System.Int32" Direction="IN" SourceType="ProcessPara" DataSource="3"/><ActualParameter Index="3" Name="Radius" DataType="System.Double" Direction="IN" SourceType="ProcessPara" DataSource="4"/><ActualParameter Index="4" Name="LowGain" DataType="System.Double" Direction="IN" SourceType="ProcessPara" DataSource="5"/><ActualParameter Index="5" Name="HighGain" DataType="System.Double" Direction="IN" SourceType="ProcessPara" DataSource="6"/><ActualParameter Index="6" Name="DstURL" DataType="System.String" Direction="IN" SourceType="ProcessPara" DataSource="2"/><ActualParameter Index="7" Name="return" DataType="System.Int32" Direction="OUT" SourceType="Constant" DataSource=""/></ActualParameters></Tool></Implementation><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="22.110524"/><ExtendedAttribute Name="ypos" Value="24.146819"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="0"/></ExtendedAttributes></Activitie><Activitie Id="4" Name="开始节点" Type="START"><Description></Description><Implementation/><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="-247.282349"/><ExtendedAttribute Name="ypos" Value="-10.702369"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="4"/></ExtendedAttributes></Activitie><Activitie Id="5" Name="结束节点" Type="END"><Description></Description><Implementation/><Icon><Icon1></Icon1><Icon2></Icon2></Icon><Performer/><ExtendedAttributes><ExtendedAttribute Name="xpos" Value="178.506507"/><ExtendedAttribute Name="ypos" Value="-60.686287"/><ExtendedAttribute Name="显示颜色" Value="0"/><ExtendedAttribute Name="显示高度" Value="0.000000"/><ExtendedAttribute Name="显示宽度" Value="0.000000"/><ExtendedAttribute Name="字体高度" Value="0.000000"/><ExtendedAttribute Name="字体宽度" Value="0.000000"/><ExtendedAttribute Name="序号" Value="5"/></ExtendedAttributes></Activitie></Activities><Transitions><Transition Id="1" From="4" To="2" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="3iHFAAnpbsDTLxFvnWclwERN9PkoVVjAdZFCWfhyPsA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="3" From="1" To="3" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="gjrl0Y3IUUAt7j8yHQ47wLafjPFhFmhAs5quJ7raN0A="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="4" From="3" To="5" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="tp+M8WEWaECzmq4nuto3QM2SADU1UGZA325JDthXTsA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="5" From="2" To="6" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="F5rrNNKZW8BS81XysdlGwM9m1edqL1jA5BJHHohoR0A="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition><Transition Id="6" From="6" To="1" Type="0" Condition=""><ExtendedAttributes><ExtendedAttribute Name="dat" Value="z2bV52ovWMDkEkceiGhHQFFsBU1LHDZAcm4T7pUlOEA="/><ExtendedAttribute Name="备注" Value=""/></ExtendedAttributes></Transition></Transitions></WorkFlowProcess></WorkFlowProcesses>';
    // let xml1 = '<WorkFlowProcess Id="10" Name="ttt" Type="OSFLOW" AcessLevel="PRIVATE"><ProcessHeader><Version></Version><Creator></Creator><Created>2021-12-4</Created><SystemBelong>MapGISToolBox</SystemBelong><Description></Description></ProcessHeader></WorkFlowProcess>'
    let myJson = XML2Json(xml1);
    console.warn('测试结果json', myJson);
  };

  modifyDropNode = (model) => {
    console.warn('成功获取', model);
    const { propsAPI } = this.props;

    let FlowIndex = this.state.indexLog;
    this.setState({
      indexLog: ++FlowIndex,
    });

    const curFlowData = propsAPI.save();
    console.warn('当前项', curFlowData); // 获取当前项

    let newFlowData = curFlowData;
    let mainNodeId = this.getMainNodeId(model, curFlowData);

    newFlowData.nodes[newFlowData.nodes.length - 1].FlowIndex = FlowIndex;

    if (!newFlowData.edges) newFlowData.edges = [];
    if (!newFlowData.groups) newFlowData.groups = [];

    if (newFlowData.groups && newFlowData.groups.length > 0) {
      newFlowData.groups.forEach((group) => {
        group.collapsed = false;
      });
    }

    // 添加输入输出节点并连线
    if (model.paramsList && model.paramsList.length > 0) {
      // 规则：n个输入、1个输出
      let initInputY = model.y - model.paramsList.length * 25;
      let initOutputY = model.y;
      let nodeLabelTooLong = 0;
      if (model.label.length > 15) {
        nodeLabelTooLong = 50;
      }

      // 先基于主节点建立组合
      let randomGroupId = Math.random().toString(36).substr(2);
      let group = {
        id: randomGroupId,
        label: model.remark || model.label,
        collapsed: false,
        FlowIndex: FlowIndex,
        isUsedCount: 0,
        useOtherCount: 0,
      };
      newFlowData.groups.push(group);

      // 将主节点放至该组合中
      let length = newFlowData.nodes.length;
      newFlowData.nodes[length - 1].parent = randomGroupId;
      newFlowData.nodes[length - 1].systemCreate = true;

      // 制作主节点所创建的对象（之前叫派生节点）
      let randomMainId = Math.random().toString(36).substr(2);
      let copyNode = {
        type: 'node',
        size: '40*40',
        shape: 'flow-circle',
        // "label": model.paramsList[i].name,
        label: 'object',
        color: '#EC3D3D',
        NodeType: NodeTypeList.OBJECT,
        x: model.x + 70 + nodeLabelTooLong,
        y: model.y - 70,
        id: randomMainId,
        parent: randomGroupId,
        FlowIndex: FlowIndex,
        systemCreate: true,
        xattrs: {
          FuntionObjSourceType: 'Default',
          PreviousNode: '',
        },
      };
      let copyEdge1 = {
        source: mainNodeId,
        sourceAnchor: 1,
        target: copyNode.id,
        targetAnchor: 2,
        systemCreate: true,
        shape: 'flow-smooth',
        FlowIndex: FlowIndex,
      };
      newFlowData.nodes.push(copyNode);
      newFlowData.edges.push(copyEdge1);

      // 循环添加输入输出节点并连线、放入组合
      for (let i = 0; i < model.paramsList.length; i++) {
        let randomId = Math.random().toString(36).substr(2);
        if (model.paramsList[i].direction.toUpperCase() === 'IN') {
          initInputY += 50;
          let node = {
            type: 'node',
            size: '100*30',
            shape: 'flow-rect',
            label: model.paramsList[i].name,
            color: '#32CD32',
            NodeType: NodeTypeList.INPUT,
            x: model.x - 150 - nodeLabelTooLong,
            y: initInputY,
            id: randomId,
            parent: randomGroupId,
            FlowIndex: FlowIndex,
            ParamIndex: i + 1,
            systemCreate: true,
            xattrs: {
              ...model.paramsList[i],
              SourceType: 'Constant',
              DataSource: '',
              ProcessParaInfo: {
                Name: model.paramsList[i].name,
                DataType: 'INT',
                Direction: 'IN',
                DefaultValue: '',
              },
              PreviousNode: '',
            },
          };
          let edge = {
            source: node.id,
            sourceAnchor: 1,
            target: mainNodeId,
            targetAnchor: 3,
            shape: 'flow-polyline-round',
            systemCreate: true,
            FlowIndex: FlowIndex,
          };
          newFlowData.nodes.push(node);
          newFlowData.edges.push(edge);
        }
        if (model.paramsList[i].direction.toUpperCase() === 'OUT') {
          // initOutputY += 75
          let node = {
            type: 'node',
            size: '100*30',
            shape: 'flow-rect',
            label: model.paramsList[i].name,
            color: '#32CD32',
            NodeType: NodeTypeList.OUTPUT,
            x: model.x + 140 + nodeLabelTooLong,
            y: initOutputY,
            id: randomId,
            parent: randomGroupId,
            FlowIndex: FlowIndex,
            OutParamIndex: i + 1,
            systemCreate: true,
            xattrs: {
              ...model.paramsList[i],
              SourceType: 'Constant',
              DataSource: '',
            },
          };
          let edge = {
            source: mainNodeId,
            sourceAnchor: 1,
            target: node.id,
            targetAnchor: 3,
            systemCreate: true,
            shape: 'flow-smooth',
            FlowIndex: FlowIndex,
          };
          newFlowData.nodes.push(node);
          newFlowData.edges.push(edge);
        }
      }
    }
    propsAPI.read(newFlowData); // 更新全部

    const node = propsAPI.find(mainNodeId);
    propsAPI.currentPage.setSelected(node, true);
    propsAPI.executeCommand('toFront');
  };

  modifyAddLine = (model) => {
    const { propsAPI } = this.props;
    // const { getSelected, executeCommand, update } = propsAPI;
    const curFlowData = propsAPI.save();
    console.warn('当前项', curFlowData); // 获取当前项

    const sourceNode = propsAPI.find(model.source);
    const targetNode = propsAPI.find(model.target);

    console.warn('成功获取连线', model);

    // 检查是否可连，若可连则继续，否则撤销该操作
    let canAddLine = this.checkLine(sourceNode, targetNode);
    if (!canAddLine.flag) {
      message.warning(canAddLine.msg);
      propsAPI.executeCommand('undo');
      return;
    }

    // 若符合规则，则将连线详情记录下来
    this.writeLineInfo(model);
  };

  writeLineInfo = (model) => {
    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();
    const sourceNode = propsAPI.find(model.source);
    const targetNode = propsAPI.find(model.target);
    // 若符合规则，则将连线详情记录下来
    let newModel = targetNode.model;
    if (newModel.xattrs && newModel.NodeType !== NodeTypeList.METHOD) {
      // 某某来源相关的连线在这里记录
      let PreviousNode = sourceNode.model.ParamIndex
        ? sourceNode.model.FlowIndex + '-' + sourceNode.model.ParamIndex
        : sourceNode.model.FlowIndex;
      newModel.xattrs.PreviousNode = PreviousNode;
      propsAPI.update(model.target, newModel);

      // 同时增加group的isUsedCount、useOtherCount计数
      if (curFlowData.groups && curFlowData.groups.length > 0) {
        curFlowData.groups.forEach((group) => {
          if (group.FlowIndex === sourceNode.model.FlowIndex) {
            let newGroup = group;
            newGroup.isUsedCount += 1;
            propsAPI.update(group.id, newGroup);
          } else if (group.FlowIndex === targetNode.model.FlowIndex) {
            let newGroup = group;
            newGroup.useOtherCount += 1;
            propsAPI.update(group.id, newGroup);
          }
        });
      }
    }

    // 流程节点相关的连线在这里记录
    if (
      sourceNode.model.NodeType === NodeTypeList.METHOD ||
      targetNode.model.NodeType === NodeTypeList.METHOD
    ) {
      let newLine = model;
      newLine.From = sourceNode.model.FlowIndex;
      newLine.To = targetNode.model.FlowIndex;
      newLine.color = '#0573E9'; // 个性化颜色设置
      propsAPI.update(model.id, newLine);
    }

    // 个性化颜色设置
    if (targetNode.model.NodeType === NodeTypeList.INPUT) {
      let newLine = model;
      newLine.color = '#32CD32';
      propsAPI.update(model.id, newLine);
    }
    if (targetNode.model.NodeType === NodeTypeList.OBJECT) {
      let newLine = model;
      newLine.color = '#EC3D3D';
      propsAPI.update(model.id, newLine);
    }
  };

  autoAddLine = (model) => {
    // console.warn('成功获取到自动连线的项', model);
    if (!model) return;

    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();
    // console.warn('当前项', curFlowData); // 获取当前项

    const sourceNode = propsAPI.find(model.source);
    const targetNode = propsAPI.find(model.target);

    // 检查是否可连，若可连则继续，否则撤销该操作
    let canAddLine = this.checkLine(sourceNode, targetNode);
    if (!canAddLine.flag) {
      message.warning(canAddLine.msg);
      return;
    }

    // 检查是否有重复线
    let edges = curFlowData.edges;
    if (edges && edges.length > 0) {
      for (let i = 0; i < edges.length; i++) {
        if (model.source === edges[i].source && model.target === edges[i].target) {
          message.warning('禁止重复连线');
          return;
        }
      }
    }

    // 检查通过后，增加该连线
    let newFlowData = curFlowData;
    if (!newFlowData.edges) newFlowData.edges = [];
    newFlowData.edges.push(model);
    propsAPI.read(newFlowData);

    // 将连线有关信息记录下来
    this.writeLineInfo(model);
  };

  checkDupStartEnd(model) {
    console.warn('成功获取', model);
    if (model.NodeType !== NodeTypeList.START && model.NodeType !== NodeTypeList.END) {
      return;
    }
    const { propsAPI } = this.props;

    const curFlowData = propsAPI.save();
    console.warn('当前项', curFlowData); // 获取当前项
    if (curFlowData.nodes && curFlowData.nodes.length > 0) {
      curFlowData.nodes.forEach((node) => {
        if (node.NodeType === model.NodeType) {
          setTimeout(() => {
            message.warning('禁止添加多个开始/结束节点');
            propsAPI.executeCommand('undo');
            propsAPI.executeCommand('undo');
          }, 0);
        }
      });
    }
  }

  checkDupLine(model) {
    // 遍历连线，检查是否有重复连线
    const { propsAPI } = this.props;

    const sourceNode = propsAPI.find(model.source);
    const targetNode = propsAPI.find(model.target);

    const sourceNodeId = sourceNode.model.id || '';
    const targetNodeId = targetNode.model.id || '';
    // const sourceNodeType = sourceNode.model.NodeType;
    // const targetNodeType = targetNode.model.NodeType;

    const curFlowData = propsAPI.save();
    // console.warn('当前项2', curFlowData); // 获取当前项
    let edges = curFlowData.edges;
    if (!edges) {
      return;
    }
    edges.forEach((edge) => {
      if (sourceNodeId === edge.source && targetNodeId === edge.target) {
        setTimeout(() => {
          if (this.checkLine(sourceNode, targetNode).flag) {
            // 如果是被系统所允许的连线，则去除掉该重复连线；而对于不被系统允许的，稍后会有其他代码去除该连线，这里不做去除
            message.warning('禁止重复连线');
            propsAPI.executeCommand('undo');
          }
        }, 0);
      }
    });
  }

  checkLine(sourceNode, targetNode) {
    // 检查连线是否符合规则:0、检查是否有重复线（渲染前已检查）；1、检查是否连接自身；2、检查是否连的是组内；3、检查是否符合LineRules；4、检查是否符合已选项；5、检查被连节点的被连线个数，只能连一条线；6、检查是否为前流程
    // const { propsAPI } = this.props;

    let result = {
      msg: '',
      flag: true,
    };
    // 1、检查是否连接自身
    if (sourceNode.model.id === targetNode.model.id) {
      result = {
        msg: '禁止与自身相连',
        flag: false,
      };
      return result;
    }

    // 2、检查是否连的是组内节点
    if (
      sourceNode.model.parent &&
      targetNode.model.parent &&
      sourceNode.model.parent === targetNode.model.parent
    ) {
      // message.warning('禁止组内节点之间相连');
      // return false
      result = {
        msg: '禁止组内节点之间相连',
        flag: false,
      };
      return result;
    }

    // 3、检查被连节点的被连接个数，输入节点和小圆圈只能被一条线所连
    if (
      targetNode.model.xattrs &&
      targetNode.model.xattrs.PreviousNode &&
      targetNode.model.xattrs.PreviousNode !== ''
    ) {
      // message.warning('禁止来源于多个节点，请先删除其他连线');
      // return false
      result = {
        msg: '禁止来源于多个节点，请先删除其他连线',
        flag: false,
      };
      return result;
    }

    // 4、检查是否符合LineRules
    const sourceNodeType = sourceNode.model.NodeType;
    const targetNodeType = targetNode.model.NodeType;
    let rule = LineRules[sourceNodeType][targetNodeType];
    if (!rule.permission) {
      // message.warning(rule.msg);
      // return false
      result = {
        msg: rule.msg,
        flag: false,
      };
      return result;
    }

    // 5、检查是否为前流程
    if (targetNodeType === NodeTypeList.INPUT || targetNodeType === NodeTypeList.OBJECT) {
      let isPrevious = this.checkPrevious(sourceNode.model.FlowIndex, targetNode.model.FlowIndex);
      if (!isPrevious) {
        result = {
          msg: '当前来源不属于前流程，请通过连线保证来源为前流程',
          flag: false,
        };
        return result;
      }
    }

    // 6、检查是否符合已选项
    if (rule.needCheckSourceType) {
      if (targetNodeType === NodeTypeList.INPUT) {
        let SourceType = targetNode.model.xattrs.SourceType;
        if (
          (SourceType === 'PreviousCallInputParamater' && sourceNodeType === NodeTypeList.INPUT) ||
          (SourceType === 'PreviousCallReturnValue' && sourceNodeType === NodeTypeList.OUTPUT) ||
          (SourceType === 'PreviousObject' && sourceNodeType === NodeTypeList.OBJECT)
        ) {
          result = {
            msg: '',
            flag: true,
          };
          return result;
        }
        // message.warning('参数来源方式与连线类型不符，请重新连线');
        // return false
        result = {
          msg: '参数来源方式与连线类型不符，请重新连线',
          flag: false,
        };
        return result;
      } else if (targetNodeType === NodeTypeList.OBJECT) {
        let SourceType = targetNode.model.xattrs.FuntionObjSourceType;
        if (
          (SourceType === 'PreviousCallCreateObject' && sourceNodeType === NodeTypeList.OBJECT) ||
          (SourceType === 'PreviousCallReturnObject' && sourceNodeType === NodeTypeList.OUTPUT)
        ) {
          result = {
            msg: '',
            flag: true,
          };
          return result;
        }
        // message.warning('功能对象来源方式与连线类型不符，请重新连线');
        // return false
        result = {
          msg: '功能对象来源方式与连线类型不符，请重新连线',
          flag: false,
        };
        return result;
      }
    }
    return result;
  }

  checkPrevious(sourceFlowIndex, targetFlowIndex) {
    const { propsAPI } = this.props;
    const curFlowData = propsAPI.save();

    // 生成“图”数据结构
    let flowGraph = {};
    if (curFlowData.edges && curFlowData.edges.length > 0) {
      curFlowData.edges.forEach((edge) => {
        if (edge.To) {
          if (!flowGraph[edge.To]) {
            flowGraph[edge.To] = [edge.From];
          } else {
            flowGraph[edge.To].push(edge.From);
          }
        }
      });
    }

    let result = false;
    let visited = new Set();
    const dfs = (n) => {
      if (n === sourceFlowIndex) {
        result = true;
      }
      visited.add(n);
      if (flowGraph[n] && flowGraph[n].length > 0) {
        flowGraph[n].forEach((c) => {
          if (!visited.has(c)) {
            dfs(c);
          }
        });
      }
    };
    dfs(targetFlowIndex);
    return result;
  }

  modifyDelete = (ids, snapShot) => {
    const { propsAPI } = this.props;

    console.warn('监控到删除', ids, snapShot);
    let deleteId = ids[0]; // 已通过禁用按钮来禁止多选
    // 遍历snapShot：（若id来自groups，则无操作；）若id来自nodes，则再删group/撤销；若id来自线，则清除记录/撤销
    if (snapShot.edges && snapShot.edges.length > 0) {
      snapShot.edges.forEach((edge) => {
        if (edge.id === deleteId) {
          if (edge.systemCreate) {
            propsAPI.executeCommand('undo');
            message.warning('不可删除系统自动创建的节点、连线');
            return;
          } else {
            const sourceNode = propsAPI.find(edge.source);
            const targetNode = propsAPI.find(edge.target);

            // 若不是系统自动创建（用户手动连接）的线，则将连线信息清除
            let newModel = targetNode.model;
            if (newModel.xattrs && newModel.NodeType !== NodeTypeList.METHOD) {
              newModel.xattrs.PreviousNode = '';
              propsAPI.update(edge.target, newModel);

              // 同时减去group的isUsedCount、useOtherCount计数
              if (snapShot.groups && snapShot.groups.length > 0) {
                snapShot.groups.forEach((group) => {
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
            }
          }
        }
      });
    }
    if (snapShot.nodes && snapShot.nodes.length > 0) {
      snapShot.nodes.forEach((node) => {
        if (node.id === deleteId) {
          if (node.systemCreate) {
            propsAPI.executeCommand('undo');
            message.warning('不可删除系统自动创建的节点、连线');
            return;
          }
        }
      });
    }
    if (snapShot.groups && snapShot.groups.length > 0) {
      snapShot.groups.forEach((group) => {
        if (group.id === deleteId) {
          if (group.isUsedCount || group.useOtherCount) {
            propsAPI.executeCommand('undo');
            message.warning('必须先将该流程与外部节点之间的连线全部删除');
            return;
          }
        }
      });
    }
  };

  getMainNodeId = (model, flowData) => {
    let length = flowData.nodes.length;
    return flowData.nodes[length - 1].id;
  };

  watchRedoEvent = () => {
    message.warning('禁止使用回撤操作！');

    // const { propsAPI } = this.props;
    // propsAPI.executeCommand('undo');
  };

  watchUndoEvent = () => {
    message.warning('禁止使用撤销操作！');

    const { propsAPI } = this.props;
    propsAPI.executeCommand('redo');
  };

  // selectNodes = (nodeId) => {
  //   const { propsAPI } = this.props;

  //   propsAPI.executeCommand('clear') // clear 清空画布

  //   propsAPI.read(mockFlowData2) // 更新全部

  //   const curFlowData = propsAPI.save();
  //   console.warn('当前项', curFlowData); // 获取当前全部flow

  //   let type = 'node';
  //   let model = {
  //     label: '添加测试',
  //     color: '#E76F00',
  //     key_a: 'addTest',
  //     "x": 56.671875,
  //     "y": 133,
  //     "shape": "flow-circle",
  //     "size": "84*84",
  //   };
  //   propsAPI.add(type, model)   //添加某一项

  //   const node = propsAPI.find(nodeId);
  //   console.warn('打印node', node ) // 按nodeId查找

  //   let model = {
  //     label: '添加测试',
  //     color: '#E76F00',
  //     key_a: 'addTest',
  //     // "x": 56.671875,
  //     // "y": 133,
  //     "shape": "flow-circle",
  //     "size": "84*84",
  //   };
  //   propsAPI.update(nodeId, model)   //更新某一项

  //   propsAPI.remove(nodeId)

  //   let selects = propsAPI.getSelected()
  //   console.warn('打印selects', selects ) // 获取选中项

  //   const node = propsAPI.find(nodeId);
  //   propsAPI.currentPage.clearSelected();
  //   propsAPI.currentPage.setSelected(node, true); // 自动选中
  // };

  render() {
    return <div></div>;
  }
}

export default withPropsAPI(Updata);
