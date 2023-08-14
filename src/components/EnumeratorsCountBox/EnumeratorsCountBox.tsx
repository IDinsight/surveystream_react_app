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

function EnumeratorsCountBox() {
  return (
    <EnumeratorsCountBoxContainer>
      <CountBox
        color="#389E0D"
        title="Active"
        count={858}
        Icon={CheckCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#CF1322"
        title="Dropped-out"
        count={62}
        Icon={CloseCircleFilled}
      />
      <RowCountDivider type="vertical" />
      <CountBox
        color="#FA8C16"
        title="Inactive"
        count={0}
        Icon={WarningFilled}
      />
    </EnumeratorsCountBoxContainer>
  );
}

export default EnumeratorsCountBox;
