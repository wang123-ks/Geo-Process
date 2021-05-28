import { Item, ItemPanel } from 'gg-editor';

import { Card, Tree } from 'antd';
import React from 'react';
import styles from './index.less';
import { HomeTwoTone, FundTwoTone, PictureTwoTone, FileWordTwoTone, BulbTwoTone, FolderTwoTone, FolderOpenTwoTone, TagsTwoTone  } from '@ant-design/icons';
// {/* <FolderTwoTone /> */}
{/* <FolderOpenTwoTone /> */}

const { TreeNode } = Tree;

const FlowItemPanel = () => {

  const getItem = (shape:string, label:string, key_a:string) => {
    let curSize = ''
    let color = ''
    switch (shape) {
      case 'flow-circle':
        curSize = '66*66';
        color= '#0573E9';
        break;
      case 'flow-rect':
        curSize = '80*48';
        color= '#E76F00';
        break;
      case 'flow-rhombus':
        curSize = '80*72';
        color= '#EC3D3D';
        break;
      case 'flow-capsule':
        curSize = '100*48';
        color= '#E76F00';
        break;
      default:
        curSize = '80*48';
        color= '#E76F00';
    };
    return (
      <Item
        type="node"
        size={curSize}
        shape={shape}
        model={{
          label: label,
          color: color,
          key_a: key_a,
        }}
      >
        <span className={styles['panel-type-icon']}>{label}</span>
      </Item>
    )
  };

  const treeData = [
    // {
    //   title: '大数据基础工具',
    //   key: '0',
    //   icon: <GoldFilled />,
    //   children: [
    //     {
    //       title: '起始节点',
    //       key: '0-0',
    //       icon: <FolderTwoTone />,
    //       children: [
    //         {
    //           title: getItem('flow-circle', '开始', 'task_start'),
    //           key: '0-0-0',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //         {
    //           // title: '结束',
    //           title: getItem('flow-circle', '结束', 'task_end'),
    //           key: '0-0-1',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //       ],
    //     },
    //     {
    //       title: '数据输入',
    //       key: '0-1',
    //       icon: <FolderTwoTone />,
    //       children: [
    //         {
    //           title: getItem('flow-capsule', '选取云盘数据', 'select_cd_data'),
    //           key: '0-1-0',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //         {
    //           title: '选取本地数据',
    //           key: '0-1-1',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //       ],
    //     },
    //     {
    //       title: '成果输出',
    //       key: '0-2',
    //       icon: <FolderTwoTone />,
    //       children: [
    //         {
    //           title: getItem('flow-capsule', '保存至云盘', 'copy_cd_data'),
    //           key: '0-2-0',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //         {
    //           title: '在线制图预览',
    //           key: '0-2-1',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //       ],
    //     },
    //     {
    //       title: '数据处理',
    //       key: '0-3',
    //       icon: <FolderTwoTone />,
    //       children: [
    //         {
    //           title: getItem('flow-capsule', '入库', 'into_db'),
    //           key: '0-3-0',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //         {
    //           title: getItem('flow-capsule', '创建金字塔', 'create_pyramid'),
    //           key: '0-3-1',
    //           switcherIcon: <TagsTwoTone />,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: '起始节点',
      key: '0',
      icon: <HomeTwoTone />,
      children: [
        {
          title: getItem('flow-circle', '开始', 'task_start'),
          key: '0-0',
          switcherIcon: <TagsTwoTone />,
        },
        {
          title: getItem('flow-circle', '结束', 'task_end'),
          key: '0-1',
          switcherIcon: <TagsTwoTone />,
        },
      ],
    },
    {
      title: '矢量大数据分析算子',
      key: '1',
      icon: <FundTwoTone />,
      children: [
        {
          title: '输入输出',
          key: '1-0',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: getItem('flow-capsule', '输入矢量数据', 'select_cd_data'),
              key: '1-0-0',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '输入表',
              key: '1-0-1',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '输出矢量数据',
              key: '1-0-2',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '输出瓦片数据', 'copy_cd_data'),
              key: '1-0-3',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '输出表',
              key: '1-0-4',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据处理',
          key: '1-1',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: getItem('flow-capsule', '创建空间索引', 'create_spatial_index'),
              key: '1-1-0',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '创建元数据', 'create_metadata'),
              key: '1-1-1',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '创建瓦片索引', 'create_tile_index'),
              key: '1-1-2',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '拷贝数据',
              key: '1-1-3',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '计算字段',
              key: '1-1-4',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '追加数据',
              key: '1-1-5',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '过滤', 'tile_filter'),
              key: '1-1-6',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '化简', 'tile_simplify'),
              key: '1-1-7',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: getItem('flow-capsule', '生成pbf', 'generate_pbf'),
              key: '1-1-8',
              switcherIcon: <TagsTwoTone />,
            },
            // {
            //   title: getItem('flow-capsule', '创建金字塔', 'tile_cut'),
            //   key: '1-1-9',
            //   switcherIcon: <TagsTwoTone />,
            // },
            // {
            //   title: getItem('flow-capsule', '瓦片裁剪', 'tile_cut'),
            //   key: '1-1-10',
            //   switcherIcon: <TagsTwoTone />,
            // },
          ]
        },
        {
          title: '数据汇总',
          key: '1-2',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '属性汇总',
              key: '1-2-0',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '范围汇总',
              key: '1-2-1',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '聚合分析',
              key: '1-2-2',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '空间分析',
          key: '1-3',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '创建缓冲区',
              key: '1-3-0',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '叠加分析',
              key: '1-3-1',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '裁剪图层',
              key: '1-3-2',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '模式分析',
          key: '1-4',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '密度分析',
              key: '1-4-0',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '热点分析',
              key: '1-4-1',
              switcherIcon: <TagsTwoTone />,
            },
            {
              title: '时空分析',
              key: '1-4-2',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
      ]
    },
    {
      title: '影像大数据分析算子',
      key: '2',
      icon: <PictureTwoTone />,
      children: [
        {
          title: '输入输出',
          key: '2-0',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '输入TIFF文件',
              key: '2-0-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '影像管理',
          key: '2-1',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '复制栅格',
              key: '2-1-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '栅格处理',
          key: '2-2',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '矢量转栅格',
              key: '2-2-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '影响汇总',
          key: '2-3',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '直方图统计',
              key: '2-3-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '模式分析',
          key: '2-4',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '密度分析',
              key: '2-4-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '地形分析',
          key: '2-5',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '坡度分析',
              key: '2-5-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
      ]
    },
    {
      title: '文本大数据分析算子',
      key: '3',
      icon: <FileWordTwoTone />,
      children: [
        {
          title: '输入输出',
          key: '3-0',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '输入文本',
              key: '3-0-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据索引',
          key: '3-1',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '文本索引',
              key: '3-1-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据挖掘',
          key: '3-2',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '关联规则',
              key: '3-2-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据处理',
          key: '3-3',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '数据发布',
              key: '3-3-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
      ]
    },
    {
      title: '空间机器学习算子',
      key: '4',
      icon: <BulbTwoTone />,
      children: [
        {
          title: '输入输出',
          key: '4-0',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '输入矢量',
              key: '4-0-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据聚类',
          key: '4-1',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '多元聚类',
              key: '4-1-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据分类',
          key: '4-2',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '最大似然分类',
              key: '4-2-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
        {
          title: '数据关联',
          key: '4-3',
          icon: ({ expanded }) => (expanded ? <FolderOpenTwoTone /> : <FolderTwoTone />),
          children: [
            {
              title: '图谱关联',
              key: '4-3-0',
              switcherIcon: <TagsTwoTone />,
            },
          ]
        },
      ]
    },
  ];

  const onSelect = (keys, event) => {
    console.log('Trigger Select', keys, event);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };

  return (
    <ItemPanel className={styles.itemPanel}>
      <div style={{ padding: '8px 0px' }}>
        <Tree
          style={{height: 670, userSelect: 'none'}}
          height={670}
          showLine
          showIcon
          defaultExpandedKeys={['0','1','2','3','4']}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
      </div>
    </ItemPanel>
  )
};

export default FlowItemPanel;
