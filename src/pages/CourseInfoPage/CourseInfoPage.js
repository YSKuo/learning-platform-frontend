import React, { useEffect } from "react";
import styled from "styled-components";
import { Button, Avatar, List, Typography } from "antd";
import { StarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourse,
  selectCourse,
  selectIsGettingCourse,
} from "../../redux/reducers/courseReducer";
import { toCurrency } from "../../utils";
import Loading from "../../components/Loading";
import { selectCartList, addCartItem } from "../../redux/reducers/cartReducer";
import { selectUser } from "../../redux/reducers/userReducer";

const CourseWrapper = styled.div`
  max-width: 760px;
  margin: 10px auto;
  padding: 16px;
  background: ${(props) => props.theme.colors.secondary.light};
  color: ${(props) => props.theme.colors.primary.text};
`;
const CourseTitle = styled.div`
  text-align: center;
  font-size: 42px;
  font-weight: bold;
`;

export default function CourseInfoPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const course = useSelector(selectCourse);
  const cartList = useSelector(selectCartList);
  const isGettingCourse = useSelector(selectIsGettingCourse);
  const { id } = useParams();
  const checkIsAlreadyInCart = () => {
    for (let i = 0; i < cartList.length; i += 1) {
      if (cartList[i].CourseId === Number(id)) {
        // 當前課程已在 cartList 內
        return true;
      }
    }
    return false;
  };
  const checkCourseIsPaid = () => {
    console.log(user);
    if (!user) return false;
    for (let i = 0; i < user.paidCourses.length; i += 1) {
      if (user.paidCourses[i].CourseId === Number(course.id)) {
        // 當前課程已在 paidCourses 內
        return true;
      }
    }
    return false;
  };

  const handleClickAddToCart = () => {
    if (!user) {
      history.push("/cartList");
    }
    if (!checkIsAlreadyInCart()) {
      dispatch(addCartItem(course.id));
    }
  };
  // component mount 時執行(初始化)
  useEffect(() => {
    dispatch(getCourse(id));
    // unmount 時先 clean up 避免下次回來時因為仍有舊資料而短暫顯示
    return () => {};
  }, [dispatch, id]);

  return (
    <>
      {isGettingCourse && <Loading />}
      {!isGettingCourse && course && (
        <CourseWrapper>
          <CourseTitle>{course.title}</CourseTitle>
          <h1 align="right">{toCurrency(course.price)}</h1>
          <div>
            <Link to={`/teacherInfo/${course.TeacherId}`}>
              <Avatar size={64} src={course.Teacher.avatarUrl} />
            </Link>
          </div>
          <p>
            <strong>開課老師：</strong>
            {course.Teacher.name}
          </p>
          <div align="right">
            {course.isPublic ? (
              <>
                {course.isCourseBought ? (
                  <Button type="primary" size="large">
                    <Link to={`/learn/${course.id}`}>開始上課</Link>
                  </Button>
                ) : (
                  <>
                    <Button type="primary" size="large">
                      <Link to={`/checkout/${course.id}`}>立即購買</Link>
                    </Button>
                    {'  '}
                    {checkIsAlreadyInCart() ? (
                      <Link to="/cartList">
                        <Button type="primary" size="large" danger>
                          前進購物車
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleClickAddToCart}
                      >
                        加入購物車
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <Button size="large" disabled>
                非公開課程
              </Button>
            )}
          </div>

          <div>
            <strong>課程介紹：</strong>
          </div>
          <p>{course.description}</p>
          <div>
            <strong>單元列表：</strong>
          </div>
          {course.unit_title && (
            <List
              size="large"
              bordered
              dataSource={course.unit_title.map((el, i) => {
                return { number: i + 1, title: el };
              })}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.number}</strong>. {item.title}
                </List.Item>
              )}
            />
          )}
        </CourseWrapper>
      )}
    </>
  );
}
