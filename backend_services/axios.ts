import axios from "axios";
const envVariable = "production" as string;
const $http = axios.create({
  baseURL:
    envVariable === "production"
      ? "https://loctech-web-api.vercel.app/api/v1"
      : // "https://carewomen-dev.vercel.app/"
        "http://localhost:3000/",
  headers: { "Content-Type": "application/json" },
});

export { $http };
