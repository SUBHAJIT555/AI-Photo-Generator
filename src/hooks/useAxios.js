import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://gamebds.com",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
