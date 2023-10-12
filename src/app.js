import "./app.css";
// import nyancat from "./nyancat.jpg";
// import axios from "axios";
import form from "./form";
// import result from "./result";

// document.addEventListener("DOMContentLoaded", () => {
//   document.body.innerHTML = `
//     <img src="${nyancat}">
//   `;
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const res = await axios.get("/api/users");
//   console.log(res);

//   document.body.innerHTML = (res.data || [])
//     .map(user => {
//       return `<div>${user.id}: ${user.name}</div>`;
//     })
//     .join("-");
// });

let resultEl;
let formEl;

document.addEventListener("DOMContentLoaded", async () => {
  formEl = document.createElement("div");
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  resultEl = document.createElement("div");
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl);
});

if (module.hot) {
  console.log("핫 모듈 켜짐??");

  module.hot.accept("./result", async () => {
    console.log("result 모듈 변경됨");
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept("./form", async () => {
    console.log("form 모듈 변경됨");
    formEl.innerHTML = form.render();
  });
}
