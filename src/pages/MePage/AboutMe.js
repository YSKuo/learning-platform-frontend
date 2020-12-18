import React, { useState } from "react";
import styled from "styled-components";
import { Divider, Row, Col } from "antd";

const AboutMeWrapper = styled.div`
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const PageTitle = styled.div`
  padding-top: 20px;
  font-size: 34px;
`;
const MeInfo = styled.div`
  text-align: center;
`;
const Info = styled(Row)`
  padding-top: 4px;
`;
const InfoTitle = styled(Col)`
  text-align: right;
`;
const InfoDetail = styled(Col)`
  text-align: left;
`;
const Update = styled(Col)`
  cursor: pointer;
  text-align: right;
  color: ${(props) => props.theme.colors.primary.main};
  transition: transform 0.3s;
  &:hover {
    text-decoration: underline;
  }
`;

export default function AboutMe() {
  const titles = [
    { title: "name", label: "姓名" },
    { title: "nickname", label: "暱稱" },
    { title: "phone_number", label: "電話" },
  ];
  const [user, setUser] = useState({
    email: "test@gmail.com",
    nickname: "test",
    phone_number: null,
    name: "測試姓名",
    AuthTypeId: 1,
  });
  return (
    <AboutMeWrapper>
      <PageTitle>個人檔案</PageTitle>
      <Divider />
      <MeInfo>
        {titles.map((info) => (
          <Info gutter={16}>
            <InfoTitle span={4} offset={5}>
              {`${info.label}:`}
            </InfoTitle>
            <InfoDetail span={6}>{user[info.title]}</InfoDetail>
            <Update span={4}>
              {user[info.title] ? `變更${info.label}` : `新增${info.label}`}
            </Update>
          </Info>
        ))}
      </MeInfo>
    </AboutMeWrapper>
  );
}
