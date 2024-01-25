import axios from "@/services/axios.service";

export function getToken() {
  const cookieValue = document.cookie.match("token=([^;]+)");
  if (cookieValue) {
    return cookieValue[1];
  } else {
    return null;
  }
}
export function removeToken() {
  //remove token from cookie
  document.cookie = `token=; expires=${new Date(
    Date.now() - 3600000
  ).toUTCString()}; path=/`;
}

export function setToken(token) {
  document.cookie = `token=${token}; expires=${new Date(
    Date.now() + 3600000
  ).toUTCString()}; path=/`;
}

export async function saveUserLocalStore(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export async function verifyToken() {
  return await axios.post("/auth/token", { token: getToken() });
}

export  function getMe() {
  const me = localStorage.getItem("me");
  return me ? JSON.parse(me) : null;
}
export function login(payload) {
  setToken(payload);
}
export function logout() {
  document.cookie = `token=; expires=${new Date(
    Date.now() - 3600000
  ).toUTCString()}; path=/`;
  location.reload();
}
