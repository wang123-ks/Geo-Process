import React, { useState } from 'react';
import { Tooltip, Button, Modal, Form, Input } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

class SetConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      defaultValue: {},
    };
  }

  componentDidMount() {
    this.getConfig();
  }

  getConfig = () => {
    let methodTreeBaseUrl = window.localStorage.getItem('methodTreeBaseUrl');
    let uploadXmlUrl = window.localStorage.getItem('uploadXmlUrl');
    if (!methodTreeBaseUrl || !uploadXmlUrl) {
      window.localStorage.setItem(
        'methodTreeBaseUrl',
        'http://192.168.199.71:8089/igs/rest/services/system/ResourceServer/workflows/functionHub',
      );
      window.localStorage.setItem(
        'uploadXmlUrl',
        'http://192.168.83.146:8089/manager/api/service/workflow/publish',
      );
      methodTreeBaseUrl = window.localStorage.getItem('methodTreeBaseUrl');
      uploadXmlUrl = window.localStorage.getItem('uploadXmlUrl');
    }
    this.setState({
      defaultValue: {
        methodTreeBaseUrl,
        uploadXmlUrl,
      },
    });
  };
  openSetIp = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  handleChangeConfig = (value) => {
    window.localStorage.setItem('methodTreeBaseUrl', value.methodTreeBaseUrl);
    window.localStorage.setItem('uploadXmlUrl', value.uploadXmlUrl);
    this.setState({
      isModalVisible: false,
    });
    // location.reload();
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  render() {
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <Tooltip title="设置">
            <Button onClick={this.openSetIp} shape="circle" icon={<SettingOutlined />} />
          </Tooltip>
        </div>
        <Modal
          visible={this.state.isModalVisible}
          title="IP设置"
          okText="提交"
          onCancel={this.handleCancel}
          okButtonProps={{ htmlType: 'submit', form: 'ipForm' }}
          width={900}
        >
          <Form
            id="ipForm"
            {...layout}
            ref={this.formRef}
            initialValues={this.state.defaultValue}
            onFinish={this.handleChangeConfig}
          >
            <Form.Item
              label="目录树请求地址："
              name="methodTreeBaseUrl"
              rules={[{ required: true, message: '请输入目录树请求地址!' }]}
            >
              <Input style={{ width: 600 }} placeholder="请输入目录树请求地址" type="textarea" />
            </Form.Item>
            <Form.Item
              label="上传地址："
              name="uploadXmlUrl"
              rules={[{ required: true, message: '请输入上传地址!' }]}
            >
              <Input style={{ width: 600 }} placeholder="请输入上传地址" type="textarea" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default SetConfig;
