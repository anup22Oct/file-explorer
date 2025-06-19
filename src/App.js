import "./styles.css";
import json from "./data.json";
import { useState } from "react";
import { FaFolderPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

const List = ({ data, addNodeToList, removeNodeFromList }) => {
  const [isExpanded, setIsExpanded] = useState({});

  return (
    <div className="container">
      {data.map((node) => (
        <div key={node.id}>
          {node.isFolder && (
            <span
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  [node.name]: !prev[node.name],
                }))
              }
            >
              {isExpanded?.[node.name] ? "- " : "+ "}
            </span>
          )}
          <span>{node.name} </span>
          {node.isFolder && (
            <>
              <span onClick={() => addNodeToList(node.id)}>
                <FaFolderPlus />
              </span>
              <span onClick={() => removeNodeFromList(node.id)}>
                <MdDelete />
              </span>
            </>
          )}
          {isExpanded?.[node.name] && node.children && (
            <List
              data={node.children}
              addNodeToList={addNodeToList}
              removeNodeFromList={removeNodeFromList}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState(json);

  const addNodeToList = (parentId) => {
    const name = prompt("Enter name");
    const newNode = {
      id: Date.now().toString(),
      name: name,
      isFolder: true,
      children: [],
    };

    const updateData = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          console.log("ParentId :" + parentId);
          return {
            ...node,
            children: [...node.children, newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateData(node.children),
          };
        }
        return node;
      });
    };

    setData((prev) => updateData(prev));
  };

  const removeNodeFromList = (nodeId) => {
    const updateList = (list) => {
      return list
        .filter((node) => node.id !== nodeId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateList(node.children) };
          }
          return node;
        });
    };
    setData((prev) => updateList(prev));
  };
  return (
    <div>
      <h1>File explorer </h1>
      <div>
        <List
          data={data}
          addNodeToList={addNodeToList}
          removeNodeFromList={removeNodeFromList}
        />
      </div>
    </div>
  );
};

export default App;
