import React from 'react';
import { Button, Modal, Form, Input, Tooltip, Popconfirm } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import styles from './index.less';

import { xmlFlow2Web } from '@/pages/EditorFlow/util/XmlFlowToWeb';

class UploadFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isModalVisible: false,
    };
  }

  uploadClick = (event) => {
    // console.warn('点击事件', event)
    let inputButton = document.getElementById('uploadInput');
    if (inputButton) inputButton.click();
  };

  UploadFile = (event) => {
    // console.warn('点击事件成功触发', event)
    const { propsAPI } = this.props;

    let reader = new FileReader();
    let files = event.target.files;
    let file;
    if (files && files.length > 0) {
      file = files[0];
    } else {
      return;
    }

    reader.onload = (e) => {
      // console.warn('读取到数据', e)
      if (e.currentTarget && e.currentTarget.result) {
        let flowXml = e.currentTarget.result;

        xmlFlow2Web(flowXml, propsAPI);
      }
    };
    reader.onerror = (stuff) => {};
    reader.readAsText(file);
  };

  render() {
    return (
      <div>
        <input
          id="uploadInput"
          type="file"
          name="file"
          accept="application/xml"
          onChange={this.UploadFile}
          style={{ display: 'none' }}
        />
        <Popconfirm
          title="是否确认上传流程图文件？上传成功后当前流程图将清空！"
          onConfirm={this.uploadClick}
          okText="是"
          cancelText="否"
        >
          <Tooltip title="点击上传" placement="bottom" overlayClassName={styles.tooltip}>
            <div style={{ ['margin']: '0 10px' }}>
              <CloudUploadOutlined style={{ cursor: 'pointer' }} />
            </div>
          </Tooltip>
        </Popconfirm>
      </div>
    );
  }
}

export default withPropsAPI(UploadFlow);
