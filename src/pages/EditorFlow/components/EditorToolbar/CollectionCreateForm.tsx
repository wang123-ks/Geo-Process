import React from 'react';
// import { connect } from 'dva';
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import { FormInstance } from 'antd/es/form';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

class CollectionCreateForm extends React.Component {
  render() {
    const { visible, title, onCancel, onSubmit, isSubmitting, defaultValue } = this.props;
    // const { getFieldDecorator } = form;
    const onFinish = (values: any) => {
      // console.warn('Success:', values);
      onSubmit(values);
    };

    return (
      <Modal
        destroyOnClose
        visible={visible}
        title={title}
        okText="提交"
        onCancel={onCancel}
        confirmLoading={isSubmitting}
        okButtonProps={{ htmlType: 'submit', form: 'editForm' }}
      >
        <Form
          id="editForm"
          {...layout}
          ref={this.formRef}
          initialValues={defaultValue}
          name="userForm"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="工作流名称："
            name="Name"
            rules={[{ required: true, message: '请输入工作流名称!' }]}
          >
            <Input style={{ width: 200 }} placeholder="请输入工作流名称" type="textarea" />
          </Form.Item>
          <Form.Item
            label="工作流编码："
            name="Id"
            rules={[{ required: true, message: '请输入编码!' }]}
          >
            <InputNumber style={{ width: 200 }} placeholder="请输入编码" type="textarea" />
          </Form.Item>
          <Form.Item label="描述：" name="Description">
            <Input style={{ width: 200 }} placeholder="请输入模型描述" type="textarea" />
          </Form.Item>
          <Form.Item label="创建人：" name="Creator">
            <Input style={{ width: 200 }} placeholder="请输入创建人" type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CollectionCreateForm;
