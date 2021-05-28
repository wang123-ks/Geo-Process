import { Divider, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import SaveModelButton from './SaveModelButton';
import ExecuteButton from './ExecuteButton';
import styles from './index.less';

const FlowToolbar = () => (
  <Toolbar className={styles.toolbar}>
    {/* <ToolbarButton command="undo" />
    <ToolbarButton command="redo" />
    <Divider type="vertical" /> */}
    <ToolbarButton command="copy" text="复制"/>
    <ToolbarButton command="paste" text="粘贴" />
    <ToolbarButton command="delete" text="删除" />
    <Divider type="vertical" />
    <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
    <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
    {/* <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" />
    <ToolbarButton command="resetZoom" icon="actual-size" text="Actual Size" /> */}
    <Divider type="vertical" />
    <ToolbarButton command="toBack" icon="to-back" text="后置" />
    <ToolbarButton command="toFront" icon="to-front" text="前置" />
    <Divider type="vertical" />
    <ToolbarButton command="multiSelect" icon="multi-select" text="多选" />
    <ToolbarButton command="addGroup" icon="group" text="组合" />
    <ToolbarButton command="unGroup" icon="ungroup" text="拆分" />
    <Divider type="vertical" />
    <SaveModelButton />
    <ExecuteButton/ >
  </Toolbar>
);

export default FlowToolbar;
