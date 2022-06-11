const form = document.getElementById("form");
const mainTasks = document.querySelector(".body .parent");
let arrayOfLocalStorage = [];
let objectsReturnFromLS = [];
let counterTask = 0;
// focus on input Task
window.onload = () => {
  taskInput.focus();
  if (localStorage.length > 0) {
    objectsReturnFromLS = JSON.parse(localStorage.myObjectsInLocalStorage);
  }
  addTheTasksFromLocalStorageToBody();
  arrayOfLocalStorage = objectsReturnFromLS;
  document.querySelector(".completed span").innerText =
    document.querySelectorAll(".parent .finished").length;
};
// controle any move [writing in input]
document.getElementById("taskInput").addEventListener("input", (eo) => {
  if (taskInput.value !== "") {
    taskInput.setAttribute("placeholder", "");
    form.style.setProperty("--opacity", "0");
  }
});
// add a new text box
form.onsubmit = (eo) => {
  // Annuler le defoult du form
  eo.preventDefault();
  // check que le input n'est pas vide

  if (taskInput.value !== "") {
    checkRepeatition();
  } else {
    taskInput.setAttribute("placeholder", "Please can you add your task!");

    form.style.setProperty("--opacity", "1");
  }
};
function createNewTask() {
  // Create a new textBox
  const textBox = document.createElement("div");
  textBox.classList.add("task-box");
  let id_OfDateNow = Date.now();
  textBox.setAttribute("id", id_OfDateNow);

  // create and add content in textBox
  const contentTextBox = document.createTextNode(taskInput.value);
  textBox.prepend(contentTextBox);

  // create delete button [text-box]
  const deleteBox = document.createElement("span");
  deleteBox.classList.add("delete");

  // create and add content in delete button [text-box]
  const contentdeleteBox = document.createTextNode("Delete");
  deleteBox.prepend(contentdeleteBox);

  // add delete button in textBox
  textBox.appendChild(deleteBox);

  // add textBox in mainTasks [body]
  mainTasks.appendChild(textBox);

  // add textBox in localStorage
  let objectOfLocalStorage = {
    id: id_OfDateNow,
    task: taskInput.value,
    completed: false,
  };
  // add textBox in array
  arrayOfLocalStorage.push(objectOfLocalStorage);
  window.localStorage.setItem(
    "myObjectsInLocalStorage",
    JSON.stringify(arrayOfLocalStorage)
  );

  // empty input
  taskInput.value = "";
  taskInput.focus();

  // add "1" in counterTask
  ++counterTask;
  document.querySelector(".get-task span").innerText = counterTask;
  checkChilds();
}
// Delete TextBox
mainTasks.onclick = (eo) => {
  if (eo.target.className == "delete") {
    // if(localStorage.length > 0){
    objectsReturnFromLS = JSON.parse(localStorage.myObjectsInLocalStorage);
    let taskReturnForDelete = objectsReturnFromLS.filter((el) => {
      if (el.id !== parseInt(eo.target.parentElement.id)) {
        return el;
      }
    });
    arrayOfLocalStorage = taskReturnForDelete;
    objectsReturnFromLS = taskReturnForDelete;
    window.localStorage.setItem(
      "myObjectsInLocalStorage",
      JSON.stringify(taskReturnForDelete)
    );

    // }
    eo.target.parentElement.remove();

    // minus "1" in counterTask
    --counterTask;
    document.querySelector(".get-task span").innerText = counterTask;
    checkChilds();
  } else {
    if (localStorage.length > 0) {
      objectsReturnFromLS = JSON.parse(localStorage.myObjectsInLocalStorage);
      let taskReturnForDelete = objectsReturnFromLS.filter((el) => {
        if (el.id === parseInt(eo.target.id)) {
          if (eo.target.classList.contains("finished")) {
            el.completed = false;
          } else {
            el.completed = true;
          }
        }
        return el;
      });
      arrayOfLocalStorage = taskReturnForDelete;

      objectsReturnFromLS = taskReturnForDelete;
      window.localStorage.setItem(
        "myObjectsInLocalStorage",
        JSON.stringify(objectsReturnFromLS)
      );
    }
    // toggle class Finished in taskBox
    eo.target.classList.toggle("finished");
  }
  checkFinished();
};
// Delete All Tasks
document.querySelector(".delete-all").onclick = () => {
  mainTasks.querySelectorAll(".task-box").forEach((item) => {
    item.remove();
    document.querySelector(".task-show").classList.remove("dn");
    counterTask = 0;

    document.querySelector(".get-task span").innerText = 0;
    document.querySelector(".completed span").innerText = 0;
    if (localStorage.length > 0) {
      arrayOfLocalStorage = [];
      objectsReturnFromLS = [];
      window.localStorage.setItem(
        "myObjectsInLocalStorage",
        arrayOfLocalStorage
      );
    }
  });
};
// finished All Tasks
document.querySelector(".finished-all").onclick = () => {
  mainTasks.querySelectorAll(".task-box").forEach((item) => {
    item.classList.add("finished");
    document.querySelector(".completed span").innerText =
      document.querySelectorAll(".parent .finished").length;
    objectsReturnFromLS.forEach((el) => {
      el.completed = true;
      window.localStorage.setItem(
        "myObjectsInLocalStorage",
        JSON.stringify(objectsReturnFromLS)
      );
    });
  });
};
// check si il y'a au mois un child dans le parent [mainTasks]
function checkChilds() {
  if (counterTask > 0) {
    document.querySelector(".task-show").classList.add("dn");
  } else {
    document.querySelector(".task-show").classList.remove("dn");
  }
}
function checkFinished() {
  document.querySelector(".completed span").innerText =
    document.querySelectorAll(".parent .finished").length;
}
// check if task repeat or no
function checkRepeatition() {
  let checkRepitition = Array.from(
    mainTasks.querySelectorAll(".task-box")
  ).filter((el) => {
    if (el.innerText === `${taskInput.value}\nDelete`) {
      return el;
    }
  });
  if (checkRepitition == 0) {
    createNewTask();
    taskInput.value = "";
  } else {
    taskInput.value = "";
    taskInput.setAttribute("placeholder", "This task already exists");
    form.style.setProperty("--opacity", "1");
    checkRepitition[0].classList.add("repeat");
    setTimeout(() => {
      checkRepitition[0].classList.remove("repeat");
    }, 500);
  }
}
// hide Instruction [التعليمات] in form
form.querySelector("#taskInput").onblur = (eo) => {
  form.style.setProperty("--opacity", "0");
  taskInput.setAttribute("placeholder", "");
};
function addTheTasksFromLocalStorageToBody() {
  if (localStorage.length > 0) {
    objectsReturnFromLS.forEach((item) => {
      const textBox = document.createElement("div");
      textBox.classList.add("task-box");
      if (item.completed == true) {
        textBox.classList.add("finished");
      }
      textBox.setAttribute("id", item.id);

      // create and add content in textBox
      const contentTextBox = document.createTextNode(item.task);
      textBox.prepend(contentTextBox);

      // create delete button [text-box]
      const deleteBox = document.createElement("span");
      deleteBox.classList.add("delete");

      // create and add content in delete button [text-box]
      const contentdeleteBox = document.createTextNode("Delete");
      deleteBox.prepend(contentdeleteBox);

      // add delete button in textBox
      textBox.appendChild(deleteBox);

      // add textBox in mainTasks [body]
      mainTasks.appendChild(textBox);
      // add textBox in localStorage
      ++counterTask;
      document.querySelector(".get-task span").innerText = counterTask;
      checkChilds();
    });
  }
}
