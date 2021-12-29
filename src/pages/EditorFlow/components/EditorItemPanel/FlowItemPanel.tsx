import { Item, ItemPanel, withPropsAPI } from 'gg-editor';
import { Card, Tree } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';

import { xmlFlow2Web } from '@/pages/EditorFlow/util/XmlFlowToWeb';

import styles from './index.less';
import {
  HomeTwoTone,
  FundTwoTone,
  PictureTwoTone,
  FileWordTwoTone,
  BulbTwoTone,
  FolderTwoTone,
  FolderOpenTwoTone,
  TagsTwoTone,
} from '@ant-design/icons';

import NodeTypeList from '@/pages/EditorFlow/util/FlowNodeType';

const { TreeNode } = Tree;

// const FlowItemPanel = () => {
const getItem = (shape: string, label: string, nodeType: string, node: object) => {
  let paramsList = [];

  if (node) {
    paramsList = node.parameters;

    let returnParam = {
      direction: 'Out',
      name: 'return',
      type: node.returnValueType,
    };
    paramsList.push(returnParam);
  }

  let curSize = '';
  let color = '';
  switch (shape) {
    case 'flow-circle':
      curSize = '60*60';
      color = '#0573E9';
      break;
    case 'flow-rect':
      curSize = '80*48';
      color = '#E76F00';
      break;
    case 'flow-rhombus':
      curSize = '80*72';
      color = '#EC3D3D';
      break;
    case 'flow-capsule':
      curSize = '100*40';
      color = '#0573E9';
      // color = '#FF9010';
      break;
    default:
      curSize = '80*48';
      color = '#E76F00';
  }
  if (label.length > 15) {
    curSize = '200*40';
  }
  return (
    <Item
      type="node"
      size={curSize}
      shape={shape}
      model={{
        label: label,
        color: color,
        // key_a: key_a,
        NodeType: nodeType,
        paramsList: paramsList,
        xattrs: node,
      }}
    >
      <span className={styles['panel-type-icon']}>{label}</span>
    </Item>
  );
};

const treeData = [
  {
    title: '起始节点',
    key: '0',
    icon: <HomeTwoTone />,
    children: [
      {
        title: getItem('flow-circle', '开始', NodeTypeList.START),
        key: '0-0',
        switcherIcon: <TagsTwoTone />,
      },
      {
        title: getItem('flow-circle', '结束', NodeTypeList.END),
        key: '0-1',
        switcherIcon: <TagsTwoTone />,
      },
      // {
      //   title: getItem('flow-capsule', '输入矢量数据', 'input_data'),
      //   key: '0-2',
      //   switcherIcon: <TagsTwoTone />,
      // },
      // {
      //   title: getItem('flow-circle', '输入参数2', 'input_data'),
      //   key: '0-3',
      //   switcherIcon: <TagsTwoTone />,
      // },
      // {
      //   title: getItem('flow-circle', '输出参数1', 'output_data'),
      //   key: '0-5',
      //   switcherIcon: <TagsTwoTone />,
      // },
    ],
  },
  {
    title: '算子节点',
    key: '1',
    icon: <BulbTwoTone />,
    children: [],
  },
  // {
  //   title: '矢量大数据分析算子',
  //   key: '1',
  //   icon: <FundTwoTone />,
  //   children: [
  //     {
  //       title: '输入输出',
  //       key: '1-0',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: getItem('flow-capsule', '输入矢量数据', 'select_cd_data'),
  //           key: '1-0-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '输入表',
  //           key: '1-0-1',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         // {
  //         //   title: '输出矢量数据',
  //         //   key: '1-0-2',
  //         //   switcherIcon: <TagsTwoTone />,
  //         // },
  //         {
  //           title: getItem('flow-capsule', '输出矢量数据', 'copy_cd_data'),
  //           key: '1-0-2',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '输出瓦片数据', 'copy_cd_data'),
  //           key: '1-0-3',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '输出表',
  //           key: '1-0-4',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据处理',
  //       key: '1-1',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: getItem('flow-capsule', '创建空间索引', 'create_spatial_index'),
  //           key: '1-1-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '创建元数据', 'create_metadata'),
  //           key: '1-1-1',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '创建瓦片索引', 'create_tile_index'),
  //           key: '1-1-2',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '拷贝数据',
  //           key: '1-1-3',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '计算字段',
  //           key: '1-1-4',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '追加数据',
  //           key: '1-1-5',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '过滤', 'tile_filter'),
  //           key: '1-1-6',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '化简', 'tile_simplify'),
  //           key: '1-1-7',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '生成pbf', 'generate_pbf'),
  //           key: '1-1-8',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         // {
  //         //   title: getItem('flow-capsule', '创建金字塔', 'tile_cut'),
  //         //   key: '1-1-9',
  //         //   switcherIcon: <TagsTwoTone />,
  //         // },
  //         // {
  //         //   title: getItem('flow-capsule', '瓦片裁剪', 'tile_cut'),
  //         //   key: '1-1-10',
  //         //   switcherIcon: <TagsTwoTone />,
  //         // },
  //       ],
  //     },
  //     {
  //       title: '数据汇总',
  //       key: '1-2',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '属性汇总',
  //           key: '1-2-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '范围汇总',
  //           key: '1-2-1',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '聚合分析',
  //           key: '1-2-2',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '空间分析',
  //       key: '1-3',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: getItem('flow-capsule', '创建缓冲区', 'copy_cd_data'),
  //           key: '1-3-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: getItem('flow-capsule', '叠加分析', 'copy_cd_data'),
  //           key: '1-3-1',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         // {
  //         //   title: '创建缓冲区',
  //         //   key: '1-3-0',
  //         //   switcherIcon: <TagsTwoTone />,
  //         // },
  //         // {
  //         //   title: '叠加分析',
  //         //   key: '1-3-1',
  //         //   switcherIcon: <TagsTwoTone />,
  //         // },
  //         {
  //           title: '裁剪图层',
  //           key: '1-3-2',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '模式分析',
  //       key: '1-4',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '密度分析',
  //           key: '1-4-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '热点分析',
  //           key: '1-4-1',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //         {
  //           title: '时空分析',
  //           key: '1-4-2',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: '影像大数据分析算子',
  //   key: '2',
  //   icon: <PictureTwoTone />,
  //   children: [
  //     {
  //       title: '输入输出',
  //       key: '2-0',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '输入TIFF文件',
  //           key: '2-0-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '影像管理',
  //       key: '2-1',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '复制栅格',
  //           key: '2-1-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '栅格处理',
  //       key: '2-2',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '矢量转栅格',
  //           key: '2-2-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '影响汇总',
  //       key: '2-3',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '直方图统计',
  //           key: '2-3-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '模式分析',
  //       key: '2-4',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '密度分析',
  //           key: '2-4-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '地形分析',
  //       key: '2-5',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '坡度分析',
  //           key: '2-5-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: '文本大数据分析算子',
  //   key: '3',
  //   icon: <FileWordTwoTone />,
  //   children: [
  //     {
  //       title: '输入输出',
  //       key: '3-0',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '输入文本',
  //           key: '3-0-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据索引',
  //       key: '3-1',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '文本索引',
  //           key: '3-1-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据挖掘',
  //       key: '3-2',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '关联规则',
  //           key: '3-2-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据处理',
  //       key: '3-3',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '数据发布',
  //           key: '3-3-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: '空间机器学习算子',
  //   key: '4',
  //   icon: <BulbTwoTone />,
  //   children: [
  //     {
  //       title: '输入输出',
  //       key: '4-0',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '输入矢量',
  //           key: '4-0-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据聚类',
  //       key: '4-1',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '多元聚类',
  //           key: '4-1-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据分类',
  //       key: '4-2',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '最大似然分类',
  //           key: '4-2-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //     {
  //       title: '数据关联',
  //       key: '4-3',
  //       icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
  //       children: [
  //         {
  //           title: '图谱关联',
  //           key: '4-3-0',
  //           switcherIcon: <TagsTwoTone />,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

const onSelect = (keys, event) => {
  console.log('Trigger Select', keys, event);
};

const onExpand = (keys, event) => {
  console.log('Trigger Expand', keys, event);
};

function updateTreeData(list, key, children) {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }

    if (node.children) {
      return { ...node, children: updateTreeData(node.children, key, children) };
    }

    return node;
  });
}

class FlowItemPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      baseUrl: '',
    };
    this.onLoadData = this.onLoadData.bind(this);
  }

  componentDidMount() {
    this.getBaseUrl();
    this.parseUrl();
  }

  parseUrl() {
    const { propsAPI } = this.props;

    // let xmlDownload = "http://192.168.80.105:9091/datastore/rest/dataset/hdfs/download/workflows/可运行流程.xml"
    // let xmlDownload = "http://192.168.199.71:8089/manager/workflow/download?workflowId=600293" // 跨域？
    // let base64xml1 = Buffer.from(xmlDownload, 'utf-8').toString('base64')
    // // let base64xml2 = encodeURIComponent(base64xml1)
    // console.warn('获取编码', base64xml1)

    // 可以与igs约定通过加密url来对下载地址进行通信
    // 加密方式：base64DownloadUrl = Buffer.from(baseDownloadUrl, 'utf-8').toString('base64')
    // 写法：http://{ip}:{port}/editorflow?flowUrl=×××
    // 示例：http://localhost:8000/editorflow?flowUrl=aHR0cDovLzE5Mi4xNjguODAuMTA1OjkwOTEvZGF0YXN0b3JlL3Jlc3QvZGF0YXNldC9oZGZzL2Rvd25sb2FkL3dvcmtmbG93cy/lj6/ov5DooYzmtYHnqIsueG1s

    let href = document.location.href;
    let base64s = href.split('flowUrl=');
    if (base64s && base64s.length > 1) {
      let base64 = base64s[1];
      // base64 = decodeURIComponent(base64);
      let xmlDownload = Buffer.from(base64, 'base64').toString('utf-8');
      axios
        .get(xmlDownload)
        .then((res) => {
          console.warn('请求结果1', res.data);
          xmlFlow2Web(res.data, propsAPI);
        })
        .catch((err) => {
          console.error('错误', err);
        });
    }
  }

  getBaseUrl() {
    const vm = this;
    axios('./config/serverConfig.json')
      .then((res) => {
        // console.warn('结果', res)
        let baseUrl = res.data.methodTreeBaseUrl;
        vm.setState({
          baseUrl: baseUrl,
        });
        this.initTree();
      })
      .catch((err) => {
        console.warn('错误', err);
      });
  }

  getWorkflowUrl = (node) => {
    // let baseUrl = 'http://192.168.199.71:8089/igs/rest/services/system/ResourceServer/workflows/functionHub'
    let baseUrl = this.state.baseUrl;

    let param = '?f=json';

    if (node.libName) {
      baseUrl = `${baseUrl}/${node.libName}`;
    }
    if (node.jarName) {
      baseUrl = `${baseUrl}/${node.jarName}`;
    }
    if (node.className) {
      baseUrl = `${baseUrl}/${node.className}`;
    }
    return baseUrl + param;
  };

  initTree() {
    let vm = this;
    let workflowUrl = this.getWorkflowUrl({});
    // let treeData = [
    //   {
    //     title: '起始节点',
    //     key: '0',
    //     // icon: <HomeTwoTone />,
    //     children: [
    //       {
    //         title: getItem('flow-circle', '开始', NodeTypeList.START),
    //         key: '0-0',
    //         switcherIcon: <TagsTwoTone />,
    //       },
    //       {
    //         title: getItem('flow-circle', '结束', NodeTypeList.END),
    //         key: '0-1',
    //         switcherIcon: <TagsTwoTone />,
    //       },
    //     ],
    //   },
    //   {
    //     title: '前端自定义',
    //     key: '2',
    //     // icon: <HomeTwoTone />,
    //     children: [
    //       {
    //         title: getItem('flow-capsule', 'ShiftInfo', NodeTypeList.METHOD, {
    //           functionId: "0431520E21E6E3043E5E8C8C2DDE05E5",
    //           functionName: "ShiftInfo",
    //           parameters: [
    //             {name: "xCellSize", type: "double", direction: "In"},
    //             {name: "yCellSize", type: "double", direction: "In"},
    //             {name: "xMin", type: "double", direction: "In"},
    //             {name: "yMin", type: "double", direction: "In"}
    //           ],
    //           returnValueType: "ShiftInfo",
    //           // FuntionObjSourceType: 'CreateNew'
    //         }),
    //         key: '2-0',
    //         switcherIcon: <TagsTwoTone />,
    //       },
    //       {
    //         title: getItem('flow-capsule', 'projectTransXClsByName', NodeTypeList.METHOD, {
    //           functionId: "299519C14B37F053C2B85F03CBECEDC6",
    //           functionName: "projectTransXClsByName",
    //           parameters: [
    //             {name: "clsName", type: "String", direction: "In"},
    //             {name: "desClsName", type: "String", direction: "In"},
    //             {name: "crsName", type: "String", direction: "In"}
    //           ],
    //           returnValueType: "String",
    //           // FuntionObjSourceType: 'CreateNew'
    //         }),
    //         key: '2-1',
    //         switcherIcon: <TagsTwoTone />,
    //       },
    //     ],
    //   },
    //   // {
    //   //   title: '算子节点',
    //   //   key: '1',
    //   //   // icon: <BulbTwoTone />,
    //   //   children: libs
    //   // }
    // ]

    // vm.setState({
    //   treeData: treeData
    // });
    axios
      .get(workflowUrl)
      .then((response) => {
        let libs = response.data.libs;
        libs.forEach((item) => {
          item.key = '1-' + item.name;
          item.title = item.name;
          item.libName = item.name;
          // item.icon = ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />)
        });

        let treeData = [
          {
            title: '起始节点',
            key: '0',
            // icon: <HomeTwoTone />,
            children: [
              {
                title: getItem('flow-circle', '开始节点', NodeTypeList.START),
                key: '0-0',
                switcherIcon: <TagsTwoTone />,
              },
              {
                title: getItem('flow-circle', '结束节点', NodeTypeList.END),
                key: '0-1',
                switcherIcon: <TagsTwoTone />,
              },
            ],
          },
          {
            title: '前端自定义',
            key: '2',
            // icon: <HomeTwoTone />,
            children: [
              {
                title: getItem('flow-capsule', 'ShiftInfo', NodeTypeList.METHOD, {
                  functionId: '0431520E21E6E3043E5E8C8C2DDE05E5',
                  functionName: 'ShiftInfo',
                  parameters: [
                    { name: 'xCellSize', type: 'double', direction: 'In' },
                    { name: 'yCellSize', type: 'double', direction: 'In' },
                    { name: 'xMin', type: 'double', direction: 'In' },
                    { name: 'yMin', type: 'double', direction: 'In' },
                  ],
                  returnValueType: 'ShiftInfo',
                }),
                key: '2-0',
                switcherIcon: <TagsTwoTone />,
              },
              {
                title: getItem('flow-capsule', 'projectTransXClsByName', NodeTypeList.METHOD, {
                  functionId: '299519C14B37F053C2B85F03CBECEDC6',
                  functionName: 'projectTransXClsByName',
                  parameters: [
                    { name: 'clsName', type: 'String', direction: 'In' },
                    { name: 'desClsName', type: 'String', direction: 'In' },
                    { name: 'crsName', type: 'String', direction: 'In' },
                  ],
                  returnValueType: 'String',
                }),
                key: '2-1',
                switcherIcon: <TagsTwoTone />,
              },
            ],
          },
          {
            title: '算子节点',
            key: '1',
            // icon: <BulbTwoTone />,
            children: libs,
          },
        ];

        vm.setState({
          treeData: treeData,
        });
      })
      .catch((error) => {
        console.warn('报错', error);
      });
  }

  onLoadData(node) {
    let vm = this;
    console.warn('打印node', node);
    return new Promise<void>((resolve) => {
      if (node.children) {
        resolve();
        return;
      }
      let workflowUrl = this.getWorkflowUrl(node);
      axios
        .get(workflowUrl)
        .then((response) => {
          let responseList = [];
          if (response.data.jars) {
            responseList = response.data.jars;
            responseList.forEach((item) => {
              item.key = item.fileId;
              item.title = item.fileName;
              item.libName = node.libName;
              item.jarName = item.fileName;
              // item.icon = ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />)
            });
          } else if (response.data.classes) {
            responseList = response.data.classes;
            responseList.forEach((item) => {
              item.key = item.classId;
              item.title = item.className;
              item.libName = node.libName;
              item.jarName = node.jarName;
              item.className = item.className;
              // item.icon = ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />)
            });
          } else if (response.data.methods) {
            responseList = response.data.methods;
            responseList.forEach((item) => {
              item.key = item.functionId;
              // item.FuntionObjSourceType = 'CreateNew'
              // item.title = item.functionName
              item.libName = node.libName;
              item.jarName = node.jarName;
              item.className = node.className;
              item.isLeaf = true;
              item.switcherIcon = <TagsTwoTone />;
              item.title = getItem(
                'flow-capsule',
                item.functionName,
                NodeTypeList.METHOD,
                JSON.parse(JSON.stringify(item)),
              );
            });
          }
          let newData = vm.state.treeData;
          newData = updateTreeData(newData, node.key, responseList);
          vm.setState({
            treeData: newData,
          });
          resolve();
        })
        .catch((error) => {
          console.warn('报错', error);
        });
    });
  }

  render() {
    return (
      <ItemPanel className={styles.itemPanel}>
        <div style={{ padding: '3px 0px' }}>
          <Tree
            style={{ height: 833, userSelect: 'none' }}
            height={833}
            showLine
            showIcon
            blockNode
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={this.state.treeData}
            loadData={this.onLoadData}
          />
        </div>
      </ItemPanel>
    );
  }
}

export default withPropsAPI(FlowItemPanel);
