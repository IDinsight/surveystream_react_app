import { Card, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { CustomBtn } from "../../modules/Mapping/Mapping.styled";

const { Text, Title } = Typography;

interface MappingCardProps {
  title: string;
  description: string;
  mappingType: string;
  surveyUID: string | undefined;
}

const MappingCard = ({
  title,
  description,
  mappingType,
  surveyUID,
}: MappingCardProps) => {
  const navigate = useNavigate();

  const handleGoButton = () => {
    const mappingName = mappingType.split("-")[0];
    if (surveyUID) {
      navigate(`/survey-information/mapping/${surveyUID}/${mappingName}`);
    } else {
      navigate(`/survey-information/mapping`);
    }
  };
  return (
    <Card
      style={{
        width: 300,
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        marginRight: 16,
      }}
    >
      <Title level={5} style={{ marginTop: 0 }}>
        {title}
      </Title>
      <Text type="secondary" style={{ display: "block" }}>
        {description}
      </Text>
      <CustomBtn
        type="primary"
        style={{ marginTop: 16, width: 80 }}
        onClick={handleGoButton}
      >
        Go
      </CustomBtn>
    </Card>
  );
};

export default MappingCard;
