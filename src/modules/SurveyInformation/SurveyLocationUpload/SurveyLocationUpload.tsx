import { Alert, Button, Col, Form, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  IconText,
  SelectItem,
  SurveyLocationUploadFormWrapper,
} from "./SurveyLocationUpload.styled";
import FileUpload from "../../../components/FileUpload";
import {
  CloudDownloadOutlined,
  DownloadOutlined,
  LinkOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import LocationTable from "./LocationTable";

function SurveyLocationUpload() {
  const navigate = useNavigate();

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [columnMatch, setColumnMatch] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const locationLabel = [
    "State",
    "State ID",
    "District",
    "District ID",
    "Block",
    "Block ID",
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#" onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <SurveyLocationUploadFormWrapper>
          {!fileUploaded || !columnMatch || hasError ? (
            <>
              <Title>Survey Location: Upload locations</Title>
              <DescriptionText>Upload locations CSV sheet</DescriptionText>
            </>
          ) : null}
          {!fileUploaded ? (
            <>
              <a href="" style={{ textDecoration: "none", color: "#2f54eb" }}>
                <LinkOutlined style={{ fontSize: "14px" }} />
                <IconText>Download template</IconText>
              </a>
              <div style={{ marginTop: "40px" }}>
                <Form layout="horizontal">
                  <Row>
                    <Col span={22}>
                      <FileUpload
                        style={{ height: "250px" }}
                        setUploadStatus={setFileUploaded}
                      />
                    </Col>
                  </Row>
                </Form>
              </div>
            </>
          ) : (
            <>
              {!columnMatch ? (
                <>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      color: "#262626",
                      marginTop: "24px",
                    }}
                  >
                    Match location table columns with locations created in “Add
                    location” step
                  </p>
                  {locationLabel.map((label: string, index: number) => {
                    return (
                      <SelectItem key={index} label={label} required>
                        <Select
                          style={{ width: 168 }}
                          placeholder="Choose column"
                          options={[]}
                        />
                      </SelectItem>
                    );
                  })}
                </>
              ) : (
                <>
                  {!hasError ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginRight: "80px",
                        }}
                      >
                        <p>Locations</p>
                        <Button type="primary" icon={<CloudDownloadOutlined />}>
                          Download CSV
                        </Button>
                      </div>
                      <LocationTable />
                    </>
                  ) : (
                    <>
                      <Alert
                        message="File parsing error,  please upload the file again after making the corrections."
                        description={
                          <p>
                            The csv file could not be uploaded because of the
                            following errors:
                            <ol>
                              <li>
                                The number of columns in the file is less than
                                the number of location labels defined in the
                                previous step.
                              </li>
                              <li>
                                3 location IDs are not unique, the cell numbers
                                are
                                <ol type="a">
                                  <li>A12</li>
                                  <li>C30</li>
                                  <li>D45</li>
                                </ol>
                              </li>
                              <li>
                                The location hierarchy with the label ‘State’
                                for the following ‘Districts’ are missing:
                                <ol type="a">
                                  <li>Kota</li>
                                  <li>Katihar</li>
                                </ol>
                              </li>
                            </ol>
                          </p>
                        }
                        type="error"
                        style={{ marginRight: "80px" }}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </SurveyLocationUploadFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationUpload;
