import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, Avatar, Row, Col } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTeacher,
  selectTeacher,
  selectIsGettingTeacher,
} from '../../redux/reducers/teacherReducer';
import { toCurrency } from '../../utils';
import CourseCard from '../../components/CourseCard'
import Loading from '../../components/Loading';

const TeacherWrapper = styled.div`
  max-width: 760px;
  margin: 10px auto;
  padding: 16px;
  background: ${(props) => props.theme.colors.secondary.light};
  color: ${(props) => props.theme.colors.primary.text};
`;
const TeacherTitle = styled.div`
  text-align: center;
  font-size: 42px;
  font-weight: bold;
`;

export default function TeacherInfoPage() {
  const dispatch = useDispatch();
  const teacher = useSelector(selectTeacher);
  const isGettingTeacher = useSelector(selectIsGettingTeacher);
  const { id } = useParams();

  // component mount 時執行(初始化)
  useEffect(() => {
    dispatch(getTeacher(id));
    // unmount 時先 clean up 避免下次回來時因為仍有舊資料而短暫顯示
    return () => {};
  }, [dispatch, id]);

  return (
    <>
      {isGettingTeacher && <Loading />}
      {!isGettingTeacher && teacher && (
        <TeacherWrapper>
          <TeacherTitle>{teacher.name}</TeacherTitle>
          <center>
            <Avatar size={120} src={teacher.avatarUrl} />
          </center>
          <h1>{teacher.description}</h1>
          <div>{teacher.name} 開的課：</div>
          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
            {teacher.Courses.map((course) => (
              <Col key={course.id} xs={12} md={8}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </TeacherWrapper>
      )}
    </>
  );
}
