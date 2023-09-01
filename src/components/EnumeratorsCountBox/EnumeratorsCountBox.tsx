import {
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import {
  EnumeratorsCountBoxContainer,
  RowCountDivider,
  RowCountValue,
  RowIconContainer,
  RowTitle,
} from "./EnumeratorsCountBox.styled";

interface ICountBox {
  color: string;
  title: string;
  count: number;
  Icon: React.FC<any>;
}

interface ERowCountBox {
  active: number;
  dropped: number;
  inactive: number;
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

const EnumeratorsCountBox = ({ active, dropped, inactive }: ERowCountBox) => {
  return (
    <EnumeratorsCountBoxContainer>
      <CountBox
        color="#389E0D"
        title="Active"
        count={active}
        Icon={CheckCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#CF1322"
        title="Dropped-out"
        count={dropped}
        Icon={CloseCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#FA8C16"
        title="Inactive"
        count={inactive}
        Icon={WarningFilled}
      />
    </EnumeratorsCountBoxContainer>
  );
};

export default EnumeratorsCountBox;
