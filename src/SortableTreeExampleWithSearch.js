import React from "react";

import "antd/dist/antd.css";
import { Button, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath, toggleExpandedForAll } from "react-sortable-tree";
import treeData from "./treeData";

import "./styles.css";
import "react-sortable-tree/style.css";
import { BrandCategoriesPage } from "./CreateFormData";

const maxDepth = 5;

const alertNodeInfo = ({ node, path, treeIndex }) => {
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
    searchString: "",
    searchFocusIndex: -1,
    searchFoundCount: 0,
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

  selectPrevMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1
    });
  };

  selectNextMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0
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
          subtitle: updatedData.subtitle 
        }
      })
    }));

  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount
    } = this.state;

    return (
      <div className="wrapper">
        <div className="bar-wrapper">
          <button onClick={this.toggleNodeExpansion.bind(this, true)}>
            Expand all
          </button>
          <button
            className="collapse"
            onClick={this.toggleNodeExpansion.bind(this, false)}
          >
            Collapse all
          </button>
          <label>Search: </label>
          <input onChange={this.handleSearchOnChange} />
          <button className="previous" onClick={this.selectPrevMatch}>
            Previous
          </button>
          <button className="next" onClick={this.selectNextMatch}>
            Next
          </button>
          <label>
            {searchFocusIndex} / {searchFoundCount}
          </label>
        </div>
        
        <div className="tree-wrapper">
          <SortableTree
            treeData={treeData}
            onChange={this.handleTreeOnChange}
            onMoveNode={({ node, treeIndex, path }) =>
              global.console.debug(
                "node:",
                node,
                "treeIndex:",
                treeIndex,
                "path:",
                path
              )
            }
            maxDepth={maxDepth}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            searchFinishCallback={(matches) =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0
              })
            }
            isVirtualized={true}
            generateNodeProps={(rowInfo) => {
              const { node } = rowInfo;
              console.log('mynode', node)
              return {
                buttons: [
                  <Space>
                  <BrandCategoriesPage initialValues={node} onChange={(values)=>{
                    this.handleNodeUpdate(rowInfo, values);}} 
                  />
                  <Popconfirm title="Silinecek, emin misin？" okText="Evet" cancelText="Hayır" onConfirm={() => this.removeNode(rowInfo)}>
                    <Button danger shape="round" icon={<DeleteOutlined />} style={{ verticalAlign: "middle" }}></Button>
                  </Popconfirm>

                  <Button className="btn btn-outline-success" shape="round"
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
