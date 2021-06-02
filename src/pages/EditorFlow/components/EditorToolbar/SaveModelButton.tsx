import React from 'react';
// import { connect } from 'dva';
import { Button, Modal, Form, Input, Tooltip, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { withPropsAPI } from 'gg-editor';
import CollectionCreateForm from './CollectionCreateForm';
import styles from './index.less'

message.config({
    top: 15,
    duration: 3,
});
// const CollectionCreateForm = Form.create({ name: 'save_template' })(
//     // eslint-disable-next-line
//     class extends React.Component {
//         render() {
//             const { visible, onCancel, onSubmit, form, isSubmitting } = this.props;
//             const { getFieldDecorator } = form;
//             return (
//                 <Modal
//                     visible={visible}
//                     title="模板保存"
//                     okText="提交"
//                     onCancel={onCancel}
//                     confirmLoading={isSubmitting}
//                     onOk={onSubmit}
//                 >
//                     <Form layout="vertical">
//                         <Form.Item label="模板名称">
//                             {getFieldDecorator('name', {
//                                 rules: [{ required: true, message: '请输入模板名称!' }],
//                             })(<Input />)}
//                         </Form.Item>
//                         <Form.Item label="描述">
//                             {getFieldDecorator('description')(<Input type="textarea" />)}
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//             );
//         }
//     },
// );

class Save extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    showModal = () => {
        this.setState({ modalVisible: true });
    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleSubmit = e => {
        const { propsAPI } = this.props;
        const data = propsAPI.save();
        console.warn('拿到我的模板', data, JSON.stringify(data))
        message.success('保存成功');
        
        this.setState({ modalVisible: false });
        // const { form } = this.formRef.props;
        // console.warn('看能不能拿到我的props', this.formRef)
        // const { dispatch } = this.props;
        // form.validateFields((err, values) => {
        //     if (err) {
        //         return;
        //     }

        //     const { propsAPI } = this.props;
        //     const data = propsAPI.save();
        //     console.warn('看能不能拿到我的模板', data)
        //     //将数据转换为接口所需参数
        //     let taskList = [];
        //     if (data.hasOwnProperty('edges')) {
        //         const edges = data.edges;
        //         for (let i in edges) {
        //             taskList.push({
        //                 'task_id': edges[i].id,
        //                 'upstream': edges[i].source,
        //             });
        //         }
        //     }
        //     const params = {
        //         name: values.name,
        //         description: values.description,
        //         task: taskList,
        //     };

        //     //上传成功后清空表单关闭弹窗
        //     dispatch({
        //         type: 'workflow/submitWorkflowTemplate',
        //         payload: params,
        //     }).then(res => {
        //         if (res && res.success) {
        //             form.resetFields();
        //             this.setState({ modalVisible: false });
        //         }
        //     });

        // });
    };

    render() {
        const { isSubmitting = false } = this.props;

        return (
            <div>
                <Tooltip
                    title='保存'
                    placement="bottom"
                    overlayClassName={styles.tooltip}
                >
                    <div onClick={this.showModal} style={{ ['marginLeft']: 16}}>
                        <SaveOutlined style={{ 'cursor': 'pointer'}}/>
                    </div>
                </Tooltip>
                {/* <div style={{ padding: 8 }}>
                    <Button onClick={this.showModal}>
                        <Icon type="save" />
            保存
        </Button>
                </div> */}

                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel}
                    onSubmit={this.handleSubmit}
                    isSubmitting={isSubmitting}
                />

            </div>
        );
    }
}

export default withPropsAPI(Save);
