import { Json2XML, XML2Json } from './XmlToJs';
import NodeTypeList from '@/pages/EditorFlow/util/FlowNodeType';

export const xmlFlow2Web = (content, propsAPI) => {
  let myJson = XML2Json(content);
  // const curFlowData = propsAPI.save()

  console.warn('检测是否有', myJson, JSON.stringify(myJson));
  // console.warn('打印json', JSON.stringify(curFlowData))

  let newFlowData = {
    nodes: [],
    edges: [],
    groups: [],
  };
  let WorkFlowProcess = myJson.WorkFlowProcesses.WorkFlowProcess;

  if (WorkFlowProcess) {
    let FormHeader = {
      ...WorkFlowProcess.$,
      ...WorkFlowProcess.ProcessHeader,
    };
    console.warn('生成保存表单填写值，等着return', FormHeader);
  }

  // 生成全局所需Map
  let FormalParameterMap = new Map();
  let useOtherListMap = new Map();
  let NodeIdListMap = new Map();
  let EdgesList = [];

  if (WorkFlowProcess && WorkFlowProcess.FormalParameters) {
    WorkFlowProcess.FormalParameters.FormalParameter.forEach((item) => {
      let key = 'FormalParameter-' + item.$.Index;
      let value = item.$;
      FormalParameterMap.set(key, value);
    });
    console.warn('生成全局参数Map', FormalParameterMap);
  }
  if (WorkFlowProcess && WorkFlowProcess.Activities) {
    WorkFlowProcess.Activities.Activitie.forEach((item) => {
      let xPos;
      let yPos;
      let FlowIndex = parseInt(item.$.Id);
      let useOtherList = [];
      item.ExtendedAttributes.ExtendedAttribute.forEach((info) => {
        if (info.$.Name === 'xpos') {
          xPos = parseFloat(info.$.Value);
        }
        if (info.$.Name === 'ypos') {
          yPos = -parseFloat(info.$.Value);
        }
      });
      if (item.$.Type === 'START' || item.$.Type === 'END') {
        let randomId = Math.random().toString(36).substr(2);
        let node = {
          type: 'node',
          size: '60*60',
          shape: 'flow-circle',
          label: item.$.Type === 'START' ? '开始节点' : '结束节点',
          color: '#0573E9',
          NodeType: item.$.Type,
          x: xPos,
          y: yPos,
          id: randomId,
          FlowIndex: FlowIndex,
        };
        newFlowData.nodes.push(node);
        NodeIdListMap.set(FlowIndex + '-' + NodeTypeList.METHOD, node.id);
      } else if (item.$.Type === 'TOOL') {
        let TOOL = item.Implementation.TOOL;
        // group、Method、object、input、output
        // group
        let randomGroupId = Math.random().toString(36).substr(2);
        let group = {
          id: randomGroupId,
          label: item.$.Name,
          collapsed: false,
          FlowIndex: FlowIndex,
          isUsedCount: 0,
          useOtherCount: 0,
        };
        newFlowData.groups.push(group);

        // 流程节点
        let randomMethodId = Math.random().toString(36).substr(2);
        let curSize = '100*40';
        if (TOOL.$.Name.length > 15) {
          curSize = '200*40';
        }
        let methodNode = {
          type: 'node',
          size: curSize,
          shape: 'flow-capsule',
          label: TOOL.$.Name,
          color: '#0573E9',
          NodeType: NodeTypeList.METHOD,
          x: xPos,
          y: yPos,
          id: randomMethodId,
          FlowIndex: FlowIndex,
          parent: randomGroupId,
          systemCreate: true,
          xattrs: {
            functionId: TOOL.$.Id,
            functionName: TOOL.$.Name,
          },
        };
        newFlowData.nodes.push(methodNode);
        NodeIdListMap.set(FlowIndex + '-' + methodNode.NodeType, methodNode.id);

        // 主节点所创建的对象（之前叫派生节点）
        let nodeLabelTooLong = 0;
        if (TOOL.$.Name.length > 15) {
          nodeLabelTooLong = 50;
        }
        let FuntionObjSourceType = 'CreateNew';
        let PreviousNode = '';
        switch (TOOL.$.FuntionObjSourceType) {
          case 'PreviousCallCreateObject':
            FuntionObjSourceType = TOOL.$.FuntionObjSourceType;
            PreviousNode = TOOL.$.ObjSourceActID;
            let preObjEdge = {
              from: TOOL.$.ObjSourceActID + '-' + NodeTypeList.OBJECT,
              to: FlowIndex + '-' + NodeTypeList.OBJECT,
            };
            EdgesList.push(preObjEdge);
            useOtherList.push(parseInt(TOOL.$.ObjSourceActID));
            break;
          case 'PreviousCallReturnObject':
            FuntionObjSourceType = TOOL.$.FuntionObjSourceType;
            PreviousNode = TOOL.$.ObjSourceActID;
            let preOutEdge = {
              from: TOOL.$.ObjSourceActID + '-' + NodeTypeList.OUTPUT,
              to: FlowIndex + '-' + NodeTypeList.OBJECT,
            };
            EdgesList.push(preOutEdge);
            useOtherList.push(parseInt(TOOL.$.ObjSourceActID));
            break;
        }
        let randomObjId = Math.random().toString(36).substr(2);
        let copyNode = {
          type: 'node',
          size: '30*30',
          shape: 'flow-circle',
          // "label": TOOL.$.Name,
          color: '#EC3D3D',
          NodeType: NodeTypeList.OBJECT,
          x: xPos + 65 + nodeLabelTooLong,
          y: yPos - 65,
          id: randomObjId,
          parent: randomGroupId,
          FlowIndex: FlowIndex,
          systemCreate: true,
          xattrs: {
            FuntionObjSourceType: FuntionObjSourceType,
            PreviousNode: PreviousNode,
          },
        };
        let copyEdge = {
          source: methodNode.id,
          sourceAnchor: 1,
          target: copyNode.id,
          targetAnchor: 2,
          systemCreate: true,
          shape: 'flow-smooth',
          FlowIndex: FlowIndex,
        };
        newFlowData.nodes.push(copyNode);
        newFlowData.edges.push(copyEdge);
        NodeIdListMap.set(FlowIndex + '-' + copyNode.NodeType, copyNode.id);

        // 输入输出节点
        let ActualParameter = TOOL.ActualParameters.ActualParameter;
        let initInputY = yPos - ActualParameter.length * 25;
        let initOutputY = yPos;
        for (let i = 0; i < ActualParameter.length; i++) {
          let SourceType = 'FLSNULL';
          let PreviousNode = '';
          let DataSource = '';
          let ProcessParaInfo = {
            Name: ActualParameter[i].$.Name,
            DataType: 'INT',
            Direction: 'IN',
            DefaultValue: '',
          };
          switch (ActualParameter[i].$.SourceType) {
            case 'ProcessPara':
              SourceType = ActualParameter[i].$.SourceType;
              ProcessParaInfo = FormalParameterMap.get(
                'FormalParameter-' + ActualParameter[i].$.DataSource,
              );
              break;
            case 'Constant':
              SourceType = ActualParameter[i].$.SourceType;
              DataSource = ActualParameter[i].$.DataSource;
              break;
            case 'PreviousObject':
              SourceType = ActualParameter[i].$.SourceType;
              PreviousNode = ActualParameter[i].$.DataSource;
              let preObjEdge = {
                from: ActualParameter[i].$.DataSource + '-' + NodeTypeList.OBJECT,
                to: FlowIndex + '-' + NodeTypeList.INPUT + '-' + ActualParameter[i].$.Index,
              };
              EdgesList.push(preObjEdge);
              useOtherList.push(parseInt(ActualParameter[i].$.DataSource));
              break;
            case 'PreviousCallInputParamater':
              SourceType = ActualParameter[i].$.SourceType;
              PreviousNode = ActualParameter[i].$.DataSource;
              let inputIndex = ActualParameter[i].$.DataSource.split('-');
              let preInputEdge = {
                from: inputIndex[0] + '-' + NodeTypeList.INPUT + '-' + inputIndex[1],
                to: FlowIndex + '-' + NodeTypeList.INPUT + '-' + ActualParameter[i].$.Index,
              };
              EdgesList.push(preInputEdge);
              useOtherList.push(parseInt(inputIndex[0]));
              break;
            case 'PreviousCallReturnValue':
              SourceType = ActualParameter[i].$.SourceType;
              PreviousNode = ActualParameter[i].$.DataSource;
              let preReturnEdge = {
                from: ActualParameter[i].$.DataSource + '-' + NodeTypeList.OUTPUT,
                to: FlowIndex + '-' + NodeTypeList.INPUT + '-' + ActualParameter[i].$.Index,
              };
              EdgesList.push(preReturnEdge);
              useOtherList.push(parseInt(ActualParameter[i].$.DataSource));
              break;
          }
          let randomInOutId = Math.random().toString(36).substr(2);
          if (ActualParameter[i].$.Direction.toUpperCase() === 'IN') {
            initInputY += 50;
            let node = {
              type: 'node',
              size: '100*30',
              shape: 'flow-rect',
              label: ActualParameter[i].$.Name,
              color: '#32CD32',
              NodeType: NodeTypeList.INPUT,
              x: xPos - 150 - nodeLabelTooLong,
              y: initInputY,
              id: randomInOutId,
              parent: randomGroupId,
              FlowIndex: FlowIndex,
              ParamIndex: parseInt(ActualParameter[i].$.Index),
              systemCreate: true,
              xattrs: {
                name: ActualParameter[i].$.Name,
                type: ActualParameter[i].$.DataType,
                direction: ActualParameter[i].$.Direction,
                SourceType: SourceType,
                DataSource: DataSource,
                ProcessParaInfo: ProcessParaInfo,
                PreviousNode: PreviousNode,
              },
            };
            let edge = {
              source: node.id,
              sourceAnchor: 1,
              target: methodNode.id,
              targetAnchor: 3,
              shape: 'flow-polyline-round',
              systemCreate: true,
              FlowIndex: FlowIndex,
            };
            newFlowData.nodes.push(node);
            newFlowData.edges.push(edge);
            NodeIdListMap.set(FlowIndex + '-' + node.NodeType + '-' + node.ParamIndex, node.id);
          }
          if (ActualParameter[i].$.Direction.toUpperCase() === 'OUT') {
            let node = {
              type: 'node',
              size: '100*30',
              shape: 'flow-rect',
              label: ActualParameter[i].$.Name,
              color: '#32CD32',
              NodeType: NodeTypeList.OUTPUT,
              x: xPos + 140 + nodeLabelTooLong,
              y: initOutputY,
              id: randomInOutId,
              parent: randomGroupId,
              FlowIndex: FlowIndex,
              OutParamIndex: parseInt(ActualParameter[i].$.Index),
              systemCreate: true,
              xattrs: {
                name: ActualParameter[i].$.Name,
                type: ActualParameter[i].$.DataType,
                direction: ActualParameter[i].$.Direction,
                SourceType: ActualParameter[i].$.SourceType,
                DataSource: ActualParameter[i].$.DataSource,
              },
            };
            let edge = {
              source: methodNode.id,
              sourceAnchor: 1,
              target: node.id,
              targetAnchor: 3,
              systemCreate: true,
              shape: 'flow-smooth',
              FlowIndex: FlowIndex,
            };
            newFlowData.nodes.push(node);
            newFlowData.edges.push(edge);
            NodeIdListMap.set(FlowIndex + '-' + node.NodeType, node.id);
          }
        }
      }
      useOtherListMap.set(FlowIndex, useOtherList);
    });
  }
  if (WorkFlowProcess && WorkFlowProcess.Transitions) {
    WorkFlowProcess.Transitions.Transition.forEach((item) => {
      let edge = {
        source: NodeIdListMap.get(item.$.From + '-' + NodeTypeList.METHOD),
        // sourceAnchor: 1,
        target: NodeIdListMap.get(item.$.To + '-' + NodeTypeList.METHOD),
        // targetAnchor: 3,
        From: item.$.From,
        To: item.$.To,
        color: '#0573E9',
      };
      newFlowData.edges.push(edge);
    });
  }
  if (EdgesList && EdgesList.length > 0) {
    EdgesList.forEach((item) => {
      let color = item.to.indexOf('INPUT') >= 0 ? '#32CD32' : '#EC3D3D';
      let edge = {
        source: NodeIdListMap.get(item.from),
        sourceAnchor: item.from.indexOf('INPUT') >= 0 ? 3 : 1,
        target: NodeIdListMap.get(item.to),
        targetAnchor: item.to.indexOf('INPUT') >= 0 ? 3 : 0,
        color: color,
      };
      newFlowData.edges.push(edge);
    });
  }
  // 还差UsedListMap发挥作用
  if (newFlowData.groups.length > 0) {
    let usedCountMap = new Map();
    for (let list of useOtherListMap.values()) {
      if (list && list.length > 0) {
        list.forEach((flowindex) => {
          if (usedCountMap.has(flowindex)) {
            usedCountMap.set(flowindex, usedCountMap.get(flowindex) + 1);
          } else {
            usedCountMap.set(flowindex, 1);
          }
        });
      }
    }
    newFlowData.groups.forEach((item) => {
      item.useOtherCount = useOtherListMap.get(item.FlowIndex).length;
      item.isUsedCount = usedCountMap.get(item.FlowIndex) || 0;
    });
  }
  console.warn('临时查看', NodeIdListMap, EdgesList, useOtherListMap);

  console.warn('效果查看', newFlowData);
  propsAPI.read(newFlowData); // 更新全部
};
