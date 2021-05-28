import React from 'react';
// import { connect } from 'dva';
import { Modal, Form, Input } from 'antd';

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};

class CollectionCreateForm extends React.Component {
    render() {
        const { visible, onCancel, onSubmit, form, isSubmitting } = this.props;
        // const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="模板保存"
                okText="提交"
                onCancel={onCancel}
                confirmLoading={isSubmitting}
                onOk={onSubmit}
            >
                <Form {...layout}>
                    <Form.Item label="模板名称：">
                        {/* {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入模板名称!' }],
                        })(<Input />)} */}
                        <Form.Item
                            name="name"
                            noStyle
                            // rules={[{ required: true, message: '请输入模板名称!' }]}
                        >
                            <Input style={{ width: 200 }} placeholder="请输入模型名称" autocomplete="off" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="描述：">
                        <Form.Item
                            name="description"
                            noStyle
                            // rules={[{ required: true, message: '请输入模型描述!' }]}
                        >
                            <Input style={{ width: 200 }} placeholder="请输入模型描述" type="textarea" autocomplete="off" />
                        </Form.Item>
                        {/* {getFieldDecorator('description')(<Input type="textarea" />)} */}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CollectionCreateForm;
