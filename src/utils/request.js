import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api', // 根据你的实际 API 地址配置
  timeout: 5000, // 设置超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(config => {
  // 在发送请求之前做些什么，例如添加 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
api.interceptors.response.use(response => {
  // 对响应数据做些什么，例如处理状态码
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    return Promise.reject(response);
  }
}, error => {
  // 对响应错误做些什么，例如处理 401, 500 等错误
  if (error.response) {
    // 请求已发出，但服务器返回了错误响应
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // 未授权，跳转到登录页面
        // router.push('/login');
        break;
      case 500:
        // 服务器错误
        alert('服务器错误，请稍后再试');
        break;
      default:
        alert(`请求失败，状态码：${status}, 错误信息：${data.message || '未知错误'}`);
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    alert('请求超时，请检查网络连接');
  } else {
    // 发生错误
    alert('请求失败，请稍后再试');
  }
  return Promise.reject(error);
});

export default api;