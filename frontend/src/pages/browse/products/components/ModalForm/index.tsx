import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Image, Input, InputNumber, Modal, Upload } from 'antd';
import type { UploadFile, UploadProps, GetProp, GetProps } from 'antd';
import { useState } from 'react';
import type { FC } from 'react';

type ModalProps = GetProps<typeof Modal> & {
    open: boolean;
    onOk: (form: any) => void;
};

// type FormInstance = GetRef<typeof Form>;
//
// const useResetFormOnCloseModal = ({ form, open }: { form: FormInstance; open: boolean }) => {
//   const prevOpenRef = useRef<boolean>();
//   useEffect(() => {
//     prevOpenRef.current = open;
//   }, [open]);
//   const prevOpen = prevOpenRef.current;

//   useEffect(() => {
//     if (!open && prevOpen) {
//       form.resetFields();
//     }
//   }, [form, prevOpen, open]);
// };

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreatePostingModalForm: FC<ModalProps> = ({ open, onOk: handleOk, onCancel, loading }) => {
    const [form] = Form.useForm();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const onOk = () => {
        handleOk(form);
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    }

    // uncomment if resetting form on modal close is desired

    // useResetFormOnCloseModal({
    //   form,
    //   open,
    // });
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    const normFile = (e: any) => {
        console.log(e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            width={1000}
            open={open}
            title="Create a Joint-Purchase Posting"
            onOk={onOk}
            onCancel={onCancel}
            footer={[
                <Button key="submit" type="primary" loading={loading} onClick={onOk}>
                    Submit
                </Button>,
            ]}
        >
            <Divider />
            <Form form={form} {...formItemLayout} layout="horizontal" name="createPostingForm">
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title of the product.' }]}>
                    <Input placeholder='The title of the posting. (should contain brand name, amount and quantity)' />
                </Form.Item>
                {/* todo! image upload logic */}
                <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        action="/upload.do"
                        listType="picture-card"
                        onPreview={handlePreview}
                    >
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
                <Form.Item name="end" label="End Date" rules={[{ required: true, message: 'Please enter the end date for the posting.' }]}>
                    <DatePicker
                        showTime
                    />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price of the product.' }]}>
                    <InputNumber style={{ width: '100%' }} placeholder='The price of the product (in KRW).' />
                </Form.Item>
                <Form.Item name="desc" label="Product Description" rules={[{ required: true, message: 'Please enter the description of the product.' }]}>
                    <Input.TextArea placeholder='Details about the product.' />
                </Form.Item>
                <Form.Item name="joint_purchase_information" label="Joint-Purchase Information" rules={[{ required: true, message: 'Please enter the joint-purchase information of the product.' }]}>
                    <Input.TextArea placeholder='What other co-buyers may need to know when joining your joint-purchase deal.' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreatePostingModalForm;