import axios from 'axios';
const axiosBase = axios.create({
	// baseURL: "https://forum-s1dy.onrender.com/api",
	baseURL: 'http://localhost:6002/api'
	// baseURL: "https://srv435851.hstgr.cloud/api",
});


export default axiosBase;