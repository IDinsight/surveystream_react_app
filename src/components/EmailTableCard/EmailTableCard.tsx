import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Button, Col, Flex, Row, Tag } from "antd";
import DraggableTag from "../DraggableTag";
import { useState } from "react";

interface EmailTableCardProps {
  tableList: any;
  setTableList: any;
  handleEditTable: any;
  disableEdit: boolean;
}

const EmailTableCard = ({
  tableList,
  setTableList,
  handleEditTable,
  disableEdit,
}: EmailTableCardProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent, tableIndex: number) => {
    const { active, over } = event;

    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const newTableList = [...tableList];
      const columnMappingArray = Object.entries(
        newTableList[tableIndex].column_mapping
      );
      const oldIndex = columnMappingArray.findIndex(
        ([key]) => key === active.id
      );

      const newIndex = columnMappingArray.findIndex(([key]) => key === over.id);

      newTableList[tableIndex].column_mapping = Object.fromEntries(
        arrayMove(columnMappingArray, oldIndex, newIndex)
      );

      setTableList(newTableList);
    }
  };

  return (
    <>
      {tableList.map((table: any, index: number) => {
        const colItems = Object.keys(table?.column_mapping).map((col) => ({
          id: col,
          text: col,
        }));

        return (
          <div
            key={index}
            style={{
              border: "1px solid #d9d9d9",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
          >
            <Row style={{ alignItems: "center" }}>
              <Col span={12}>
                <p
                  style={{ fontWeight: "bold", fontSize: "18px", marginTop: 0 }}
                >
                  {table.variable_name}
                </p>
              </Col>
              <Col style={{ textAlign: "right" }} span={12}>
                <Button
                  type="link"
                  onClick={() => handleEditTable(index)}
                  disabled={disableEdit}
                >
                  Edit table
                </Button>
              </Col>
            </Row>
            <Row style={{ marginBottom: "4px" }}>
              <Col span={24}>
                <p style={{ fontWeight: "bold", margin: 0 }}>Selected table:</p>
                <p style={{ margin: 0 }}>{table.table_name}</p>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  Selected columns:
                </p>
                <p
                  style={{
                    fontSize: 12,
                    margin: 0,
                    marginBottom: 16,
                    color: "grey",
                  }}
                >
                  You can change the order of columns in the table by dragging
                  them.
                </p>
                <DndContext
                  sensors={sensors}
                  onDragEnd={(event) => handleDragEnd(event, index)}
                  collisionDetection={closestCenter}
                >
                  <SortableContext
                    items={colItems}
                    strategy={horizontalListSortingStrategy}
                  >
                    <Flex gap="4px 0" wrap>
                      {colItems.map((item: any) => (
                        <DraggableTag tag={item} key={item.id} />
                      ))}
                    </Flex>
                  </SortableContext>
                </DndContext>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                  Total filter groups:
                </p>
                <p style={{ margin: 0 }}>
                  {table.filter_list?.length || "None"}
                </p>
              </Col>
              <Col span={12}>
                <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                  Total sorts:
                </p>
                <p style={{ margin: 0 }}>
                  {Object.keys(table.sort_list).length || "None"}
                </p>
              </Col>
            </Row>
          </div>
        );
      })}
    </>
  );
};

export default EmailTableCard;
