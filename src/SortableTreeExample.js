import React from "react";

import "antd/dist/antd.css";
import { Button, Space, Popconfirm } from "antd";
import { DeleteOutlined, LeftCircleOutlined, LeftOutlined, PlusCircleOutlined, RightCircleOutlined, RightOutlined } from "@ant-design/icons";

import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath, toggleExpandedForAll } from "react-sortable-tree";
import {treeData} from "./treeData";

import "./styles.css";
import "react-sortable-tree/style.css";
import { BrandCategoriesUpdateButton } from "./CreateFormData";

const maxDepth = 5;

const alertNodeInfo = ({ node, path, treeIndex }) => {
  console.log(node)
  const objectString = Object.keys(node)
    .map((k) => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
    .join(",\n   ");

  global.alert(
    "Info passed to the button generator:\n\n" +
      `node: {\n   ${objectString}\n},\n` +
      `path: [${path.join(", ")}],\n` +
      `treeIndex: ${treeIndex}`
  );
};

const getNodeKey = ({ treeIndex }) => treeIndex;

export class App extends React.Component {
  state = {
    modalVisible: false,
    treeData
  };

  handleTreeOnChange = (treeData) => {
    this.setState({ treeData });
  };

  handleSearchOnChange = (e) => {
    this.setState({
      searchString: e.target.value
    });
  };

  toggleNodeExpansion = (expanded) => {
    this.setState((prevState) => ({
      treeData: toggleExpandedForAll({ treeData: prevState.treeData, expanded })
    }));
  };

  handleNodeClick = (node) => {
    this.setState({ clickedNode: node });
  };

  addNode = () =>{
    this.setState((prevState) =>({
      treeData:addNodeUnderParent({
        treeData: prevState.treeData,
        parentKey: null,
        expandParent: true,
        getNodeKey,
        newNode: { title: "Yeni Eleman" }
      }).treeData
    }));
  }

  removeNode = (rowInfo) => {
    const { path } = rowInfo;
    this.setState((prevState) => ({
      treeData: removeNodeAtPath({
        treeData: prevState.treeData,
        path,
        getNodeKey
      })
    }));
  };

  handleNodeUpdate = (rowInfo, updatedData) =>{
    const { node, path } = rowInfo;
    const { children } = node;
    this.setState((prevState) => ({
      treeData: changeNodeAtPath({
        treeData: prevState.treeData,
        path,
        getNodeKey,
        newNode:{
          children,
          title: updatedData.title,
          subtitle: updatedData.subtitle,
          categories: updatedData.categories
        }
      })
    }));

  }

  render() {
    const { treeData, } = this.state;

    return (
      <div className="wrapper">
        <div className="bar-wrapper">
          <Space>
            <Button shape="round" type="primary" icon={<PlusCircleOutlined />} style={{ backgroundColor: '#0000ff' }}
            onClick={this.addNode.bind(this)} >
              Yeni eleman
            </Button>
            <Button shape="round" type="primary" icon={<LeftCircleOutlined />} style={{ backgroundColor: '#00bb00' }}
            onClick={this.toggleNodeExpansion.bind(this, false)} >
              Daralt
            </Button>
            <Button shape="round" type="primary" icon={<RightCircleOutlined />} style={{ backgroundColor: '#00bb00' }}   
             onClick={this.toggleNodeExpansion.bind(this, true)}>
              Genişlet
            </Button>
           </Space>
           <br/> <br/>
        </div>
        
        <div className="tree-wrapper">
          <SortableTree
            rowHeight={60}
            treeData={treeData}
            onChange={this.handleTreeOnChange}
            onMoveNode={({ node, treeIndex, path }) =>
              global.console.debug(
                "node:", node, 
                "treeIndex:", treeIndex,
                "path:", path
              )
            }
            maxDepth={maxDepth}
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            isVirtualized={true}
            generateNodeProps={(rowInfo) => {
              const { node, lowerSiblingCounts } = rowInfo;
              // console.log('mynode', node)
              return {
                buttons: [
                  <Space>
                  <BrandCategoriesUpdateButton initialValues={node} onChange={(values)=>{
                    this.handleNodeUpdate(rowInfo, values);
                    console.log(values);
                  }} 
                  />
                  <Popconfirm title="Silinecek, emin misin？" okText="Evet" cancelText="Hayır" onConfirm={() => this.removeNode(rowInfo)}>
                    <Button danger shape="round" size = "small" icon={<DeleteOutlined />} style={{ verticalAlign: "middle" }}></Button>
                  </Popconfirm>

                  <Button className="btn btn-outline-success" size="small" shape="round"
                    style={{ verticalAlign: "middle" }}
                    onClick={() => alertNodeInfo(rowInfo)}
                  >
                    ℹ
                  </Button>
                  </Space>
                ],
                // onClick: () => {
                //   this.handleNodeClick(node);
                //   console.log(node);
                // }
              };
            }}
          />
        </div>
      </div>
    );
  }
}
