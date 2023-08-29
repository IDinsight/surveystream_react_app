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
interface IRowCountBox {
  total: number;
  correct: number;
  error: number;
  warning: number;
}

const RowCountBox = ({ total, correct, error, warning }: IRowCountBox) => {
  return (
    <RowCountBoxContainer>
      <CountBox
        color="#000"
        title="Total rows found"
        count={total}
        Icon={InsertRowAboveOutlined}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#389E0D"
        title="Correct rows"
        count={correct}
        Icon={CheckCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#CF1322"
        title="Rows with errors"
        count={error}
        Icon={CloseCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#FA8C16"
        title="Rows with warnings"
        count={warning}
        Icon={WarningFilled}
      />
    </RowCountBoxContainer>
  );
};

export default RowCountBox;
