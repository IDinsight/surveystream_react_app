import { CheckCircleFilled } from "@ant-design/icons";
import {
  TargetsCountBoxContainer,
  RowCountValue,
  RowIconContainer,
  RowTitle,
} from "./TargetsCountBox.styled";

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

function TargetsCountBox({ total }: { total: number }) {
  return (
    <TargetsCountBoxContainer>
      <CountBox
        color="#389E0D"
        title="Total target"
        count={total}
        Icon={CheckCircleFilled}
      />
    </TargetsCountBoxContainer>
  );
}

export default TargetsCountBox;
