import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Job from "./Job";
import "../../sass/jobList.scss";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Select,
  Space,
} from "antd";
import { Bounce, toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";
const JobList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState(location.state.user.jobs);
  const [pages, setPages] = useState<number[]>([]);
  const [pagesLimit, setPagesLimit] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [titleModal, setTitleModal] = useState("Thêm mới công việc");
  const [jobId, setJobId] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("-1");
  const [statusUpdate, setStatusUpdate] = useState("1");
  const [order, setOrder] = useState("ORDER");
  const [sort, setSort] = useState("ASC");
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    const getJobs = async () => {
      const response = await axios.get(
        `http://localhost:3000/jobs/user/${location.state.user.userId}?title=${
          search ?? null
        }&status=${status}&page=${page}&limit=${limit}&order=${
          order !== "ORDER" ? order : "createdDate"
        }&sort=${sort}`
      );
      setJobs(response.data.data[0]);

      setPages(
        Array.from(
          { length: Math.ceil(response.data.data[1] / limit) },
          (_, i) => i + 1
        )
      );
    };
    getJobs();
  }, [refreshPage, search, status, order, sort, page, limit]);

  const showModal = (job?: {
    jobId: number;
    title: string;
    content: string;
    deadline: string;
    status: string;
  }) => {
    if (job) {
      setTitleModal("Cập nhật công việc");
      setJobId(job.jobId);
      setTitle(job.title);
      setContent(job.content);
      setDeadline(job.deadline.slice(0, 16));
      setStatusUpdate(job.status);
    } else {
      setTitleModal("Thêm mới công việc");
      setJobId(0);
      setTitle("");
      setContent("");
      setDeadline("");
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (titleModal === "Thêm mới công việc") {
      const response = await axios.post("http://localhost:3000/jobs/create", {
        title: title,
        content: content,
        deadline: deadline,
        userId: location.state.user.userId,
      });
      if (response.data.data) {
        setRefreshPage((pre) => !pre);
        toast.success("Thêm công việc thành công!!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error(response.data.error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } else {
      if (jobId !== 0) {
        const response = await axios.put(
          `http://localhost:3000/jobs/update/${jobId}`,
          {
            title: title,
            content: content,
            deadline: deadline,
            status: statusUpdate,
            userId: location.state.user.userId,
          }
        );
        if (response.data.data) {
          setRefreshPage((pre) => !pre);
          toast.success("Cập nhật công việc thành công!!!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } else {
          toast.error(response.data.error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const onOk = (
  //   value: DatePickerProps["value"] | RangePickerProps["value"]
  // ) => {
  //   console.log("onOk: ", value);
  // };

  const handleChangeStatusUpdate = (value: string) => {
    setStatusUpdate(value);
  };

  return (
    <div className="container-jobs">
      <div
        className="content-logout"
        style={{
          width: "100%",
        }}>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>
      <div className="job-list">
        <span className="title-page">Danh sách công việc</span>
        <div className="filters">
          <div className="filters-left">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              defaultValue={"STATUS"}
              name="status"
              id=""
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}>
              <option value="-1">Trạng thái</option>
              <option value="1">Chưa hoàn thành</option>
              <option value="0">Hoàn thành</option>
              <option value="2">Đã hủy</option>
            </select>
            <select
              defaultValue={"ORDER"}
              name="order"
              id=""
              className="select"
              value={order}
              onChange={(e) => setOrder(e.target.value)}>
              <option value="ORDER">Sắp xếp</option>
              <option value="createdDate">Ngày tạo</option>
              <option value="deadline">Deadline</option>
            </select>
            <select
              defaultValue={"SORT"}
              name="sort"
              id=""
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}>
              <option value="ASC">Tăng dần</option>
              <option value="DESC">Giảm dần</option>
            </select>
            <input
              type="number"
              value={limit}
              min={1}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="limit"
            />
          </div>
          <Button type="primary" onClick={() => showModal()}>
            + Thêm mới
          </Button>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}>
              <span style={{ fontSize: "40px", fontWeight: "bold" }}>
                {titleModal}
              </span>
              <div
                className="form-input-job"
                style={{
                  width: "70%",
                  height: "40px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <label
                  htmlFor="title"
                  className="label-insert-job"
                  style={{ fontSize: "15px" }}>
                  Tiêu đề
                </label>
                <Input
                  style={{ width: "80%", height: "40px" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div
                className="form-input-job"
                style={{
                  width: "70%",
                  height: "40px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "50px 0",
                }}>
                <label
                  htmlFor="content"
                  className="label-insert-job"
                  style={{ fontSize: "15px" }}>
                  Mô tả
                </label>
                <TextArea
                  style={{ width: "80%" }}
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div
                className="form-input-job"
                style={{
                  width: "70%",
                  height: "40px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}>
                <label
                  htmlFor="deadline"
                  className="label-insert-job"
                  style={{ fontSize: "15px" }}>
                  Deadline
                </label>
                <DatePicker
                  style={{
                    width: "80%",
                    height: "40px",
                  }}
                  showTime
                  onChange={(value, dateString) => {
                    setDeadline(dateString.toString());
                    console.log("Selected Time: ", value);
                    console.log("Formatted Selected Time: ", dateString);
                  }}
                  // onOk={onOk}
                />
              </div>
              {titleModal === "Cập nhật công việc" ? (
                <div
                  className="form-input-job"
                  style={{
                    width: "70%",
                    height: "40px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}>
                  <label
                    htmlFor="status-update"
                    className="label-insert-job"
                    style={{ fontSize: "15px" }}>
                    Trạng thái
                  </label>
                  <Space wrap>
                    <Select
                      defaultValue="1"
                      value={statusUpdate.toString()}
                      style={{ width: 150 }}
                      onChange={handleChangeStatusUpdate}
                      options={[
                        { value: "1", label: "Chưa hoàn thành" },
                        { value: "0", label: "Hoàn thành" },
                        { value: "2", label: "Đã hủy" },
                      ]}
                    />
                  </Space>
                </div>
              ) : null}
            </div>
          </Modal>
        </div>

        <div className="jobs">
          {jobs?.map(
            (job: { title: string; content: string; deadline: string }) => (
              <Job
                job={job}
                showModal={showModal}
                setRefreshPage={setRefreshPage}
              />
            )
          )}
        </div>

        <div className="pages">
          <Button
            shape="circle"
            onClick={() => setPage(1)}
            style={{ margin: "5px" }}>
            {`<<`}
          </Button>
          <Button
            shape="circle"
            onClick={() => setPage((pre) => (pre <= 1 ? 1 : pre - 1))}
            style={{ margin: "5px" }}>
            {`<`}
          </Button>
          {pages?.map((p) => (
            <Button
              type={page === p ? "primary" : "default"}
              shape="circle"
              onClick={() => setPage(p)}
              style={{ margin: "5px" }}>
              {p}
            </Button>
          ))}
          <Button
            shape="circle"
            onClick={() =>
              setPage((pre) => (pre >= pages[pages.length - 1] ? pre : pre + 1))
            }
            style={{ margin: "5px" }}>
            {`>`}
          </Button>
          <Button
            shape="circle"
            onClick={() => setPage(pages[pages.length - 1])}
            style={{ margin: "5px" }}>
            {`>>`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobList;
