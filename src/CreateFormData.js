import React, { useState } from "react";
import { Button, Modal, Form, Input, TreeSelect } from "antd";
import "antd/dist/antd.css";

import category_tree from './categoryData'

const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;

const onTreeSelectChange = value => {
  console.log('onChange ', value);
  // setSelectedCategories(value);
  //this.onSelectChange(value)
};

const CreateForm = (props) => {
  const { visible, setVisible, onCreate, initialValues } = props;
  const [form] = Form.useForm();

  // when initial is changed, update it in the form
  if(initialValues)
    form.setFieldsValue(initialValues);

  const tPropsMulti = {
    treeData: category_tree,
    // value: initialValues.categories, //selectedCategories,
    onChange: onTreeSelectChange,
    treeCheckable: true, // allows us to select multiple
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select', style: { width: '100%', },
    labelInValue: true, listHeight: 750, showSearch: true, treeNodeFilterProp: 'title'
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      }); 
  };
  return (
    <Modal
      visible={visible}
      title="Change information below"
      okText="Ok"
      onCancel={() => { setVisible(false); }}
      onOk={handleCreate}
    >
      <Form form={form} initialValues={initialValues} layout="vertical">
        <Form.Item label="Title" name="title" rules={[ { required: true, message: "Please input the title of collection!" } ]} > 
          <Input />
        </Form.Item>

        <Form.Item label="Subtitle" name="subtitle" rules={[ {  message: "Please input the subtitle of collection!" } ]} >
          <Input />
        </Form.Item>

        <Form.Item label="Marka Kategorileri" name="categories">
           <TreeSelect {...tPropsMulti} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * Function version of the component below
 * @param {function} onChange when change occurs
 */
export const BrandCategoriesUpdateButton = ({ onChange, initialValues }) => {
  // const { onChange } = props;
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    onChange(values);
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" ghost shape="round" size="small"
        onClick={() => { setVisible(true); }}
      >
        update
      </Button>
      <CreateForm 
        visible={visible} 
        setVisible={setVisible} 
        onCreate={onCreate} 
        initialValues={initialValues}/>
    </div>
  );
};

/**
 * Class version of the component above
 * @param {function} onChange when change occurs
 */
export class BrandCategoriesUpdateButton2 extends React.Component {
  state = {
    visible: false
  };

  constructor(props) {
    super(props);
    this.onChange = this.props.onChange;
  }

  setVisible = (bool) => {
    this.setState({ visible: bool });
  };

  onCreate = (values) => {
    this.onChange(values);
    this.setVisible(false);
  };

  // It renders a button and a model consists of a form
  // Create form component
  render() {
    return (
      <div>
        <Button
          primary
          shape="round"
          onClick={() => {
            this.setVisible(true);
          }}
        >
          New Collection
        </Button>
        <CreateForm
          visible={this.state.visible} // visibility flag
          setVisible={this.setVisible} // setVisible function as parameter
          onCreate={this.onCreate} // when form completed this function will bring the values
        />
      </div>
    );
  }
}

// render(<CollectionsPage />, document.getElementById("root"));
