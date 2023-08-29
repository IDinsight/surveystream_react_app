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

interface RowCountBox {
  totalRows: number;
  correctRows: number;
  errorRows: number;
  warningRows: number;
}

const RowCountBox = ({
  totalRows,
  correctRows,
  errorRows,
  warningRows,
}: RowCountBox) => {
  return (
    <RowCountBoxContainer>
      <CountBox
        color="#000"
        title="Total rows found"
        count={totalRows}
        Icon={InsertRowAboveOutlined}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#389E0D"
        title="Correct rows"
        count={correctRows}
        Icon={CheckCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#CF1322"
        title="Rows with errors"
        count={errorRows}
        Icon={CloseCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#FA8C16"
        title="Rows with warnings"
        count={warningRows}
        Icon={WarningFilled}
      />
    </RowCountBoxContainer>
  );
};

export default RowCountBox;
