import {
  CheckCircleFilled,
  CloseCircleFilled,
  InsertRowAboveOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  RowCountBoxContainer,
  RowCountDivider,
  RowCountValue,
  RowIconContainer,
  RowTitle,
} from "./RowCountBox.styled";

interface ICountBox {
  color: string;
  title: string;
  count: number;
  Icon: React.FC<any>;
}

const CountBox = ({ color, title, count, Icon }: ICountBox) => {
  return (
    <div style={{ color }}>
      <RowTitle style={{ color }}>{title}</RowTitle>
      <RowIconContainer>
        <Icon style={{ fontSize: 24 }} />
        <RowCountValue color={color}>{count}</RowCountValue>
      </RowIconContainer>
    </div>
  );
};

function RowCountBox() {
  return (
    <RowCountBoxContainer>
      <CountBox
        color="#000"
        title="Total rows found"
        count={987}
        Icon={InsertRowAboveOutlined}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#389E0D"
        title="Correct rows"
        count={858}
        Icon={CheckCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#CF1322"
        title="Rows with errors"
        count={62}
        Icon={CloseCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#FA8C16"
        title="Rows with warnings"
        count={0}
        Icon={WarningFilled}
      />
    </RowCountBoxContainer>
  );
}

export default RowCountBox;
