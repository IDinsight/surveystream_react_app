import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import {
  CountDivider,
  CountIconContainer,
  CountTitle,
  CountValue,
  MappingCountBoxContainer,
} from "./MappingCountBox.styled";
import { GlobalStyle } from "../../shared/Global.styled";

interface ICountBox {
  color: string;
  title: string;
  count: number;
  Icon: React.FC<any>;
}

const CountBox = ({ color, title, count, Icon }: ICountBox) => {
  return (
    <div style={{ color }}>
      <CountTitle style={{ color }}>{title}</CountTitle>
      <CountIconContainer>
        <Icon style={{ fontSize: 24 }} />
        <CountValue color={color}>{count}</CountValue>
      </CountIconContainer>
    </div>
  );
};

interface IMappingCountBox {
  mapped: number;
  unmapped: number;
}

const MappingCountBox = ({ mapped, unmapped }: IMappingCountBox) => {
  return (
    <>
      <GlobalStyle />
      <MappingCountBoxContainer>
        <CountBox
          color="#389E0D"
          title="Users Mapped"
          count={mapped}
          Icon={CheckCircleFilled}
        />
        <CountDivider type="vertical" />
        <CountBox
          color="#CF1322"
          title="Users Not Mapped"
          count={unmapped}
          Icon={CloseCircleFilled}
        />
      </MappingCountBoxContainer>
    </>
  );
};

export default MappingCountBox;
