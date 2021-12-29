import React from 'react';
// import { connect } from 'dva';
import { Modal, Form, Input, Button } from 'antd';

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
    const { visible, title, onCancel, onSubmit, form, isSubmitting } = this.props;
    // const { getFieldDecorator } = form;
    const onFinish = (values: any) => {
      // console.warn('Success:', values);
      onSubmit(values);
    };

    return (
      <Modal
        visible={visible}
        title={title}
        okText="提交"
        onCancel={onCancel}
        confirmLoading={isSubmitting}
        okButtonProps={{ htmlType: 'submit', form: 'editForm' }}
      >
        <Form id="editForm" {...layout} name="userForm" autoComplete="off" onFinish={onFinish}>
          <Form.Item
            label="工作流名称："
            name="Name"
            rules={[{ required: true, message: '请输入工作流名称!' }]}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            label="描述："
            name="Description"
            // rules={[{ required: true, message: '请输入模型描述!' }]}
          >
            <Input style={{ width: 200 }} placeholder="请输入模型描述" type="textarea" />
          </Form.Item>
          <Form.Item
            label="创建人："
            name="Creator"
            // rules={[{ required: true, message: '请输入模型描述!' }]}
          >
            <Input style={{ width: 200 }} placeholder="请输入创建人" type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CollectionCreateForm;
