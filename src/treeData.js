import React from "react";
import { Button, Input, Tag } from "antd";
import "antd/dist/antd.css";

const maxDepth = 5;

const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

const API_URL = "https://starwars.egghead.training/";

function queryAPI(endpoint) {
  return fetch(API_URL + endpoint).then((response) => {
    return response.ok
      ? response.json()
      : Promise.reject(Error("Unsuccessful response"));
  });
}

export const treeData = [
  {
    title: "Aydınlatmalar",
    expanded: true,
    children: [
      {
        title: "Masa Lambaları",
        categories: [
          { value: "L-1.1.3.2", label: "MASA LAMBALARI" },
          { value: "L-1.2.3.1", label: "MASA LAMBALARI" }
        ]
      },
      {
        title: 'Lambaderler',
        categories: [
          { value: "L-1.1.3.3", label: "LAMBADERLER" },
          { value: "L-1.2.3.2", label: "LAMBADERLER" }
        ]
      },
      { title: 'Ev Aydınlatmaları',
        categories: [
          { value: "L-1.1.4.1", label: "MOBİLYA AYDINLATMALARI" },
          { value: "L-1.1.4.2", label: "LED SİSTEMLER" },
        ]
      }
    ]
  },
  {
    expanded: true,
    title: "Mobilyalar",
    children: [
      { title: "Toplantı Masaları"}, 
      { title: "Koferans Masaları"}, 
      { title: "Seminer Masaları"}, 

    ]
  },
  {
    title: "Show node children by setting `expanded`",
    subtitle: ({ node }) => `expanded: ${node.expanded ? "true" : "false"}`,
    children: [
      {
        title: "Bruce",
        subtitle: ({ node }) => `expanded: ${node.expanded ? "true" : "false"}`,
        children: [{ title: "Bruce Jr." }, { title: "Brucette" }]
      }
    ]
  },
  {
    title: "Advanced",
    subtitle: "Settings, behavior, etc.",
    children: [
      {
        title: (
          <div>
            <div
              style={{
                backgroundColor: "gray",
                display: "inline-block",
                borderRadius: 10,
                color: "#FFF",
                padding: "0 5px"
              }}
            >
              Any Component
            </div>
            &nbsp;can be used for `title`
          </div>
        ),
      },
      {
        expanded: true,
        title: "Limit nesting with `maxDepth`",
        subtitle: `It's set to ${maxDepth} for this example`,
        children: [
          {
            expanded: true,
            title: renderDepthTitle,
            children: [
              {
                expanded: true,
                title: renderDepthTitle,
                children: [
                  { title: renderDepthTitle },
                  {
                    title: ({ path }) =>
                      path.length >= maxDepth
                        ? "This cannot be dragged deeper"
                        : "This can be dragged deeper"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Disable dragging on a per-node basis with the `canDrag` prop",
        subtitle: "Or set it to false to disable all dragging.",
        noDragging: true
      },
      {
        title: "You cannot give this children",
        subtitle:
          "Dropping is prevented via the `canDrop` API using `nextParent`",
        noChildren: true
      },
      {
        title:
          "When node contents are really long, it will cause a horizontal scrollbar" +
          " to appear. Deeply nested elements will also trigger the scrollbar."
      }
    ]
  },
  { title: "akif" }
];

// queryAPI("films").then((res) => {
//   let arr = res.map((it) => {
//     return { title: it.title };
//   });

//   console.log(arr);
//   treeData = treeData.concat(arr);

//   console.log(treeData);
// });

// export treeData;

  // traverses old tree and changes its attributes such as value and title 
//   const traverseChange = (tree) => {
//     const item = {};

//     item.key = tree.title;
//     item.title = tree.title;
//     item.value = tree.title;
    
//     if(tree.children)
//       item.children = tree.children.map(child => traverseChange(child));

//     return item;
//   }

// export const treeData2 = treeData.map((tree) => {
//   return traverseChange(tree)
//   // console.log('akif',tree)

//   }
//   );
