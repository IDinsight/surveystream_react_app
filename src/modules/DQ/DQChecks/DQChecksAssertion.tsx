import { Col, Row, Tag, Input, Button } from "antd";
import {
  DeleteFilled,
  PlusCircleFilled,
  PlusSquareFilled,
} from "@ant-design/icons";

interface IDQCheckAssertionProps {
  assertions: any[];
  setAssertions: any;
}

function DQChecksAssertion({
  assertions,
  setAssertions,
}: IDQCheckAssertionProps) {
  const handleAssertFieldChange = (
    groupIndex: number,
    assertIndex: number,
    field: string,
    value: any
  ) => {
    setAssertions((prev: any) =>
      prev.map((group: any, i: number) =>
        i === groupIndex
          ? {
              ...group,
              assert_group: group.assert_group.map((assert: any, j: any) =>
                j === assertIndex ? { ...assert, [field]: value } : assert
              ),
            }
          : group
      )
    );
  };

  const handleRemoveAssertion = (groupIndex: number, assertIndex: number) => {
    setAssertions((prev: any) =>
      prev
        .map((group: any, i: number) => {
          if (i === groupIndex) {
            const updatedAssertGroup = group.assert_group.filter(
              (_: any, j: any) => j !== assertIndex
            );
            return updatedAssertGroup.length > 0
              ? { ...group, assert_group: updatedAssertGroup }
              : null;
          }
          return group;
        })
        .filter((group: any) => group !== null)
    );
  };

  const handleAddCondition = (groupIndex: number) => {
    setAssertions((prev: any) => {
      const newAssertions = [...prev];
      newAssertions[groupIndex].assert_group.push({
        assertion: "",
      });
      return newAssertions;
    });
  };

  const handleRemoveAssertionGroup = (groupIndex: number) => {
    setAssertions((prev: any) =>
      prev.filter((_: any, index: number) => index !== groupIndex)
    );
  };

  const handleAddAssertionGroup = () => {
    setAssertions((prev: any) => [
      ...prev,
      {
        assert_group: [
          {
            assertion: "",
          },
        ],
      },
    ]);
  };

  return (
    <>
      {assertions?.map((item: any, groupIndex: number) => (
        <>
          {groupIndex !== 0 && groupIndex !== assertions.length ? (
            <Row
              gutter={16}
              justify="center"
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <Col span={2}>
                <Tag color="#108ee9">OR</Tag>
              </Col>
            </Row>
          ) : null}
          <div
            key={groupIndex}
            style={{
              border: "1px solid #D3D3D3",
              padding: 8,
              marginBottom: 16,
            }}
          >
            {item.assert_group.map((assert: any, assertIndex: number) => (
              <div key={assertIndex}>
                {assertIndex !== 0 &&
                assertIndex !== item.assert_group.length ? (
                  <Row
                    gutter={16}
                    justify="center"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Col span={2}>
                      <Tag color="#87d068">AND</Tag>
                    </Col>
                  </Row>
                ) : null}
                <Row gutter={16} style={{ marginBottom: 6 }}>
                  <Col span={12}>
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Input assertion"
                      value={assert.assertion}
                      onChange={(e) =>
                        handleAssertFieldChange(
                          groupIndex,
                          assertIndex,
                          "assertion",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Button
                    danger
                    onClick={() =>
                      handleRemoveAssertion(groupIndex, assertIndex)
                    }
                  >
                    <DeleteFilled />
                  </Button>
                </Row>
              </div>
            ))}
            <Button
              type="link"
              icon={<PlusSquareFilled />}
              onClick={() => handleAddCondition(groupIndex)}
            >
              Add another assertion
            </Button>
            <Button
              type="link"
              icon={<PlusSquareFilled />}
              onClick={() => handleRemoveAssertionGroup(groupIndex)}
              danger
            >
              Delete the group
            </Button>
          </div>
        </>
      ))}
      <Button
        type="dashed"
        style={{ marginBottom: 16 }}
        icon={<PlusCircleFilled />}
        onClick={handleAddAssertionGroup}
      >
        Add assertion group
      </Button>
    </>
  );
}

export default DQChecksAssertion;
