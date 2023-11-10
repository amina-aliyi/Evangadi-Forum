import React, { useState } from "react";
import axios from "./axiosConfig";
import "./AskQuestion.css";
import ArrowCircleRightTwoToneIcon from "@mui/icons-material/ArrowCircleRightTwoTone";
function Ask() {
	const [newQuestion, setQuestion] = useState("");
	const [description, setDescription] = useState("");
	const [postAlert, setPostAlerts] = useState("");
	const [errorAlert, seterrorAlerts] = useState("");
	const postQuestion = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"/questions/ask",
				{
					title: newQuestion,
					description: description,
					// tag: "tag_here", // You can replace with the actual tag
				},
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			setPostAlerts("Question posted successfully.");
			setQuestion("");
			setDescription("");
			setTimeout(() => {
				setPostAlerts("");
			}, 3000);
		} catch (error) {
			console.log(error);
			seterrorAlerts("An error occurred while posting the question.");
			setQuestion("");
			setDescription("");
			setTimeout(() => {
				seterrorAlerts("");
			}, 3000);
		}
	};

	return (
		<div className="container mt0p">
			<div className="row">
				<div className="tocenter col-sm-12">
					<div className="purples">
						<h1 className="askTitle">Steps To Write A Good Question.</h1>
						<h3 className="subAsk">
							<ArrowCircleRightTwoToneIcon className="topurpel" />
							Summarize your problems in a one-line-title.
						</h3>
						<h3 className="subAsk">
							<ArrowCircleRightTwoToneIcon className="topurpel" />
							Describe your problem in more detail.
						</h3>
						<h3 className="subAsk">
							<ArrowCircleRightTwoToneIcon className="topurpel" />
							Review your question and post it here.
						</h3>
						<h1 className="tocenter">Post Your Question</h1>
					</div>
					{postAlert && <div className="Alert">{postAlert}</div>}
					{errorAlert && <div className="Alert">{errorAlert}</div>}
					<form action="#">
						<div>
							<input
								type="text"
								placeholder="Question title"
								onChange={(e) => setQuestion(e.target.value)}
								style={{ width: "90%", height: "50px", margin: "10px" }}
							/>
						</div>
						<div>
							<input
								style={{ width: "90%", height: "100px", margin: "10px" }}
								type="text"
								placeholder="Question details..."
								onChange={(e) => setDescription(e.target.value)}
								// rows={4}
							/>
						</div>
						<button
							onClick={postQuestion}
							className="blue"
							style={{ margin: "5px" }}
						>
							Post Question
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Ask;
