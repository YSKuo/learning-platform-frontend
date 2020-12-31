import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourse,
  updateCourse,
  selectCourse,
  selectIsGettingCourse,
} from "../../redux/reducers/courseReducer";
import styled from "styled-components";
import {
  Layout,
  Breadcrumb,
  Button,
  Table,
  Tag,
  Space,
  Typography,
} from "antd";
import {
  MEDIA_QUERY_MOBILE_M,
  MEDIA_QUERY_MOBILE_L,
  MEDIA_QUERY_TABLET,
} from "../../constants/breakpoint";
import CourseSettingForm from "../../components/CourseSettingForm";
import Loading from "../../components/Loading";
const { Content } = Layout;
const { Text } = Typography;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormContainer = styled(Content)`
  padding: 24px;
  background-color: ${(props) => props.theme.colors.white};
`;

export default function CourseSettingPage() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const isGettingCourse = useSelector(selectIsGettingCourse);

  useEffect(() => {
    dispatch(getCourse(id));

    return () => {};
  }, [dispatch, id]);

  const onFinish = (values) => {
    // console.log("values", values);
    const input = { ...values, isPublic: course.isPublic };
    console.log("input", input);
    dispatch(updateCourse(input));
    // history.push(`/console/courses/${id}`); // 把頁面導向課程列表
  };

  return (
    <>
      {isGettingCourse && <Loading />}
      {!isGettingCourse && course && (
        <>
          <InfoHeader>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <Link to="/console/courses">課程列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/console/courses/${id}`}>課程管理</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>課程設定</Breadcrumb.Item>
            </Breadcrumb>
            <Space size="large">
              <div>
                <Text>目前課程狀態：</Text>
                <Text mark>{course.isPublic ? "已公開" : "未公開"}</Text>
              </div>
              <Button type="primary">
                <Link>{course.isPublic ? "隱藏課程" : "公開課程"}</Link>
              </Button>
            </Space>
          </InfoHeader>
          <FormContainer>
            {course && (
              <CourseSettingForm onFinish={onFinish} course={course} />
            )}
          </FormContainer>
        </>
      )}
    </>
  );
}
