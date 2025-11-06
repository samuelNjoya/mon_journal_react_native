import axios, { AxiosInstance } from "axios";
const API_BASE_API = "http://192.168.1.162:8000/api"
// le remplacer prochainement par le secure Store
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjRkNjE4OTVlMzg0MzMxZTEwOWYyYzQ2Y2VkYWEwNTZhMzBhMWM1MDkyM2NkZDhkY2IyZWJhMjcxMzQyZmI0ZjUxN2U5ZGFjNWQ1ZWU2ZWQiLCJpYXQiOjE3NTYzOTQ1MzMsIm5iZiI6MTc1NjM5NDUzMywiZXhwIjoxNzg3OTMwNTMzLCJzdWIiOiIyMTI5NTEiLCJzY29wZXMiOltdfQ.AL8qjU5cr1sP5NFa4c90KCfQIIMZ3P3RuoX4w834xtKx-jzRd-36JC033cobielzT_fU8zUbeanJq3zT5mOMIp8z4vVy1lJaL1_nVyWDHQ7DmPyd9JgRjWn_WZ-AJ_zl5z86Trw4Ngf_fIYiSJhe-sB-hoWrPumZ2cf8qPAsRv7L9GqV8iLYIkIYTcNZTE57tjIt8IvzQBtJaxEgKBHKLORXLiC0m1kIV9e28hDlU1jc08gTNzq0fujH-YI914RISxRqwUJN5TltEV4luv6tDU23kgBkyF6abHvBX2BH3vO8oXtRBF-iZKg1ZBTjd4VACUZ_Y_sjiAgtFBuiQiUgTdbipChN7hfpVEbh4WKhX4SiEVJJL4oOZQ4ynxmMmAJdKkNOjOdjK90mBIsaSvpVdoQ5vjEfQOilWhG7Edgdf9ywaLx6wF8LYR6CMfF5XAGKzfaTYQoBLRJ1DPa4n_IsfkkpuNTdSN2iIyasFJn3sQerpsUPMPhmeyb7VixYTDUcme8xRr3EkYLOix0TbXrR3G80JiskGlQsiZ_wEfYs_diEEgB0Qu6vEsQnrgWFuWpqImk66RsWDZjxfseNGfnvnKD9ZTFa99wWFeJhoh7bkxc8jaSi7aDuY_nz_gfAulhF4BcjhMaGtlKJgYXtoUDkFAv3woSok8mQJ7THLojOFYs"
const sessionToken = "$2y$10$SfBtWLPpCS6DztROqk1Z3eoVFv01iW2EW3oIreiCxB4/q6GaWO2ii"

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_API,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${token}`,  // <--- token d'auth si nécessaire
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // if(autToken){
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    if (sessionToken) {
      if (config.method === 'get') {
        config.params = { ...config.params, sessionToken };
      } else if (config.method === 'post' && config.data) {
        config.data = { ...config.data, sessionToken };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }

)