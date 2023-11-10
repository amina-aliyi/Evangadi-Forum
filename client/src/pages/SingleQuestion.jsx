import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "./axiosConfig";
// import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import { CgProfile } from "react-icons/cg";
import './SingleQuestion.css'
function SingleQuestion() {
	const navigate = useNavigate();
	const { questionid } = useParams();
	const [question, setQuestion] = useState("");
	const [description, setDescription] = useState("");
	const [answers, setAnswers] = useState([]);
	const [newAnswer, setNewAnswer] = useState("");
	const [alertMessage, setAlertMessage] = useState("");
	// useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");

				// Fetch the question details
				const questionResponse = await axios.get(
					`/questions/question/${questionid}`,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);
				console.log(questionResponse);
				setQuestion(questionResponse.data.title.toUpperCase());
				setDescription(questionResponse.data.description.toLowerCase());

				// Fetch answers for the specific question
				const response = await axios.get(`/answers/all-answers/${questionid}`, {
					headers: {
						Authorization: "Bearer " + token,
					},
				});

				if (response.data.msg) {
					alert("Success message: " + response.data.msg);
				}
				const answersArray = Object.values(response.data);
				setAnswers(answersArray);
				console.log(answersArray);
				// setAnswers(Object.values(response.data));
				console.log(response);
			} catch (error) {
				console.error("Error fetching question or answers:", error);
			}
	};
	
  useEffect(() => {
		// Fetch data when the component mounts or when questionid changes
		fetchData();
	}, [questionid]);

	// 	fetchData();
	// }, [questionid]);

	const handlePostAnswer = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`/answers/question/${questionid}`,
				{ answer: newAnswer },
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);

			if (response.data.msg) {
				setAlertMessage(" success"+" " + response.data.msg);
			}
			fetchData();
			// const newAnswerData = {
			// 	answer: newAnswer,
			// 	// You can include other fields here if needed
			// };
			// setAnswers([...answers, newAnswerData]);
			setAnswers([...answers, { answer: newAnswer }]);
			console.log(answers);
			setNewAnswer("");
			setTimeout(() => {
				setAlertMessage("");
			}, 3000);
		} catch (error) {
			console.error("Error posting answer:", error);
		}
	};
	// fetchData();
	return (
		<section className="forbackGrounds">
			<div className="container">
				<div className=" row thewhole">
					<div className="col-md-12 max-width">
						<h1 className="titlequestion">QUESTION</h1>
						<h4 className="question">{question}</h4>
						<span className="description">{description}</span>
						<div>
							<h1 className="answerTitle">Answers From the Community</h1>
						</div>
						<ul className="QuestionList scrollable-div">
							{answers[0]?.map((answer, index) => (
								<li key={answer.answerid} className="AnswerItem">
									<div className="QuestionInfo">
										<div className="flex-row">
											<CgProfile className="Avatar" />
											<span className="username">{answer.username}</span>
										</div>
										<div>{answer.answer}</div>
									</div>
								</li>
							))}
							<div className="usernames">
								{answers[1] && (
									<li key="newAnswer" className="AnswerItem">
										<div>
											<span className="usersname">{answers[1].answer} </span>
										</div>
									</li>
								)}
							</div>
						</ul>

						<div className="fortopmr">
							{alertMessage && <div className="alert">{alertMessage}</div>}
							<textarea
								style={{ width: "100%", height: "100px" }}
								value={newAnswer}
								onChange={(e) => setNewAnswer(e.target.value)}
								placeholder="Your answer..."
							/>
							<button
								onClick={handlePostAnswer}
								className="blue m-r"
								style={{ margin: "10px" }}
							>
								Post Answer
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


export default SingleQuestion;



