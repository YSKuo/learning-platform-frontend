import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUnitListByCourse,
  updateLocalUnitList,
  updateUnitList,
  selectUnit,
  selectUnitList,
  selectCourse,
  selectIsLoading,
} from "../../redux/reducers/unitReducer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { Layout, Breadcrumb, Button, Typography, Divider, Space } from "antd";
import {
  MEDIA_QUERY_MOBILE_M,
  MEDIA_QUERY_MOBILE_L,
  MEDIA_QUERY_TABLET,
} from "../../constants/breakpoint";
import CourseUnitsList from "../../components/CourseUnitsList";
// import { dummyData } from "../../components/CourseUnitsList/dummyData";
import Loading from "../../components/Loading";
const { Content } = Layout;
const { Title } = Typography;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseContent = styled(Content)`
  padding: 24px;
  background-color: ${(props) => props.theme.colors.white};
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function SpecificCoursePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);
  const unitList = useSelector(selectUnitList);
  const isLoading = useSelector(selectIsLoading);
  // const [unitList, setUnitList] = useState([]);

  useEffect(() => {
    dispatch(getUnitListByCourse(id));
    // console.log("course", course);
    // setUnitList(unitListFromStore);
    // if (unitListFromStore) setUnitList(unitListFromStore);

    return () => {};
  }, [dispatch, id]);

  function handleOnDragEnd(result) {
    if (!result) return;

    if (result.destination.index === result.source.index) {
      return;
    }

    const units = reorder(
      unitList,
      result.source.index,
      result.destination.index
    );

    dispatch(updateLocalUnitList(units));
    // setUnitList(units);
  }

  const handleAddUnit = () => {
    const unitId = nanoid();
    const unit = { id: unitId, title: "新課程" };

    dispatch(updateLocalUnitList([...unitList, unit]));
    // setUnitList([...unitList, unit]);
  };

  const handleDelete = (id) => {
    const newUnitList = unitList.filter((item) => item.id !== id);
    dispatch(updateLocalUnitList(newUnitList));
    // setUnitList(newUnitList);
  };

  const handleSaveUnitList = () => {
    dispatch(updateUnitList(id, unitList));
    // const unitListToDb = { unit_list: unitList };
    // console.log(unitListToDb);
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && course && (
        <>
          <InfoHeader>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <Link to="/console/courses">課程列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>課程管理({course.title})</Breadcrumb.Item>
            </Breadcrumb>
            <Space>
              <Button type="primary" onClick={handleSaveUnitList}>
                儲存變更
              </Button>
              <Link to={`/console/courses/${id}/course-setting`}>
                <Button type="primary">課程設定</Button>
              </Link>
            </Space>
          </InfoHeader>
          <CourseContent>
            <>
              <Title>{course.title}</Title>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="courseContent">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <CourseUnitsList
                        unitList={unitList}
                        placeholder={provided.placeholder}
                        handleAddUnit={handleAddUnit}
                        handleDelete={handleDelete}
                      />
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          </CourseContent>
        </>
      )}
    </>
  );
}
