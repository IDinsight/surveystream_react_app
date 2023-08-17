import { Button, Col, Input, Row } from "antd";
import {
  OptionText,
  RowEditingModalContainer,
  RowEditingModalHeading,
} from "./RowEditingModal.styled";

interface IRowEditingModal {
  data: any;
  fields: any;
  onCancel: () => void;
  onUpdate: () => void;
}

function RowEditingModal({
  data,
  fields,
  onCancel,
  onUpdate,
}: IRowEditingModal) {
  const cancelHandler = () => {
    // Write code here for any cleanup
    onCancel();
  };

  const updateHandler = () => {
    // Write here for passing the data to update the record
    onUpdate();
  };

  return (
    <RowEditingModalContainer>
      <RowEditingModalHeading>
        {data && data.length > 1
          ? `Edit ${data.length} enumerators in bulk`
          : "Edit enumerator"}
      </RowEditingModalHeading>
      {data && data.length > 1 ? (
        <OptionText style={{ width: 410, display: "inline-block" }}>
          {`Bulk editing is only allowed for ${fields
            .map((item: any) => item.label)
            .join(", ")}.`}
        </OptionText>
      ) : null}
      <br />
      {data && data.length > 0 ? (
        <>
          {fields.map((field: any, idx: number) => {
            return (
              <Row key={idx}>
                <Col span={10}>
                  <p>
                    <span style={{ color: "red" }}>*</span>{" "}
                    <OptionText>{field.label}:</OptionText>
                  </p>
                </Col>
                <Col
                  span={12}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Input
                    style={{ width: 250 }}
                    placeholder={data[0][field.labelKey]}
                  />
                </Col>
              </Row>
            );
          })}
        </>
      ) : null}
      <div style={{ marginTop: 20 }}>
        <Button onClick={cancelHandler}>Cancel</Button>
        <Button
          type="primary"
          style={{ marginLeft: 30, backgroundColor: "#2f54eB" }}
          onClick={updateHandler}
        >
          Update
        </Button>
      </div>
    </RowEditingModalContainer>
  );
}

export default RowEditingModal;
