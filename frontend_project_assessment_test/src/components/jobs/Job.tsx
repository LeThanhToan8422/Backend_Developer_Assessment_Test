import axios from "axios";
import "../../sass/job.scss";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import moment from "moment";
import { Button } from "antd";

const Job = ({ job, showModal, setRefreshPage }) => {
  const status = ["Hoàn thành", "Chưa hoàn thành", "Đã hủy"];
  const [currentStatus, setCurrentStatus] = useState(job.status);

  const handleClickDelete = async () => {
    const response = await axios.delete(
      `http://localhost:3000/jobs/${job.jobId}`
    );
    if (response.data.data) {
      setRefreshPage((pre: boolean) => !pre);
      toast.success("Xóa công việc thành công!!!", {
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
  };

  const handleChangeStatus = async (index: number) => {
    const response = await axios.put(
      `http://localhost:3000/jobs/update/${job.jobId}`,
      {
        title: job.title,
        content: job.content,
        deadline: job.deadline,
        status: index,
        userId: job.userId,
      }
    );
    console.log(response.data);

    setRefreshPage((pre: boolean) => !pre);
    setCurrentStatus(index);
  };
  return (
    <div className="job">
      <div className="title-ud">
        <span className="title">{job.title}</span>
        <div className="ud">
          <Button
            color="primary"
            variant="outlined"
            style={{ marginRight: "5px" }}
            onClick={() => showModal(job)}>
            Sửa
          </Button>
          <Button color="danger" variant="outlined" onClick={handleClickDelete}>
            Xóa
          </Button>
        </div>
      </div>
      <span>{job.content}</span>
      <div className="form-txt">
        <span className="title-txt">Trạng thái : </span>
        {status.map((st, index) => (
          <div style={{ margin: "0 5px" }}>
            <input
              id={`${st}${index}${job.jobId}`}
              type="checkbox"
              checked={index === job.status}
              value={currentStatus}
              onChange={() => handleChangeStatus(index)}
            />
            <label htmlFor={`${st}${index}${job.jobId}`}>{st}</label>
          </div>
        ))}
      </div>
      <div className="date">
        <div className="form-txt">
          <span className="title-txt">Ngày tạo :</span>
          <span>{moment(job.createdDate).format("lll")}</span>
        </div>
        <div className="form-txt">
          <span className="title-txt">Deadline :</span>
          <span>{moment(job.deadline).format("lll")}</span>
        </div>
      </div>
    </div>
  );
};

export default Job;
