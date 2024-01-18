// 获取页面中的元素
const loadButton = document.querySelector(".load");
const saveButton = document.querySelector(".save");
const textList = document.querySelector(".text-list");
const textInput = document.querySelector(".text-input");
const addButton = document.querySelector(".add");

// 定义一个数组来存储文本列表中的内容
let texts = [];

// 定义一个函数来渲染文本列表
function renderTextList() {
  // 清空文本列表的内容
  textList.innerHTML = "";
  // 遍历文本数组，为每个文本创建一个列表项，并添加到文本列表中
  texts.forEach((text, index) => {
    // 创建一个列表项元素
    const li = document.createElement("li");
    // 设置列表项的内容为文本
    li.textContent = text;
    // 为列表项添加一个点击事件监听器，当点击时，将文本复制到文本编辑框中，并记录当前的索引
    li.addEventListener("click", () => {
      textInput.value = text;
      textInput.dataset.index = index;
    });
    // 将列表项添加到文本列表中
    textList.appendChild(li);
  });
}


// 定义一个函数来加载文本列表
async function loadTextList() {


  const pickerOpts = {
    multiple: false,
};
const files = await window.showOpenFilePicker(pickerOpts);
const file = await files[0].getFile();
const text = await file.text();

  // 使用localStorage API来获取存储在本地的文本数组，如果没有则使用一个空数组
  texts = JSON.parse(text || "[]");
  // 调用渲染文本列表的函数
  renderTextList();
}

// 定义一个函数来保存文本列表
async function saveTextList() {
  // 使用localStorage API来存储文本数组到本地
  const jsonText =  JSON.stringify(texts);

  const newHandle = await window.showSaveFilePicker();

    // 创建一个 FileSystemWritableFileStream 用于写入。
    const writableStream = await newHandle.createWritable();

    // 写入我们的文件。
    await writableStream.write(jsonText);

    // 关闭文件并将内容写入磁盘。
    await writableStream.close();
}

// 定义一个函数来添加文本到文本列表
function addText() {
  // 获取文本编辑框中的内容
  const text = textInput.innerText;
  // 如果内容为空，则不执行任何操作
  if (!text) return;
  // 获取文本编辑框中的索引，如果有则表示是编辑模式，否则是添加模式
  const index = textInput.dataset.index;
  if (index) {
    // 编辑模式，根据索引修改文本数组中的对应元素
    texts[index] = text;
    // 删除文本编辑框中的索引
    delete textInput.dataset.index;
  } else {
    // 添加模式，将内容推入文本数组中
    texts.push(text);
  }
  // 清空文本编辑框中的内容
  textInput.value = "";
  // 调用渲染文本列表的函数
  renderTextList();
}

// 为加载按钮添加一个点击事件监听器，当点击时，调用加载文本列表的函数
loadButton.addEventListener("click", loadTextList);

// 为保存按钮添加一个点击事件监听器，当点击时，调用保存文本列表的函数
saveButton.addEventListener("click", saveTextList);

// 为添加按钮添加一个点击事件监听器，当点击时，调用添加文本的函数
addButton.addEventListener("click", addText);

// 为文本编辑框添加一个按键事件监听器，当按下回车键时，调用添加文本的函数
//textInput.addEventListener("keydown", (event)

const popup = document.getElementById("popup");

const popupList = document.getElementById("list");

let popupList_Items = ["这是一个文本提示内容", "这是一个测试宽度的文本提示内容1111111111111111"];

function f填充popupList() {
  // 定义一个数组变量
  popupList.innerHTML = "";
  // 遍历数组变量，为每个元素创建一个列表项
  for (var i = 0; i < popupList_Items.length; i++) {
    // 创建一个列表项元素
    var li = document.createElement("li");
    // 设置列表项的文本内容
    li.textContent = popupList_Items[i];
    // 设置列表项的id属性，以便于在JavaScript中获取和操作
    li.id = "item-" + i;
    // 将列表项添加到列表中
    popupList.appendChild(li);
  }
}


textInput.addEventListener("input", (e) => {
  console.log(e);

  if (!e.data) {
    popup.style.display = "none";
    return;
  }
  f填充popupList();
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  selection_sta = saveSelection();
  selectedIndex = -1;
  popup.style.display = "block";


  popup.style.left = rect.right + "px";
  popup.style.top = rect.bottom + "px";
});


let selection_sta = null;

function insertTextAtCaret(text) {
  var sel, range;
  sel = window.getSelection();
  if (sel.getRangeAt && sel.rangeCount) {
    range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    sel.collapseToEnd();
  }
}

function saveSelection() {
  sel = window.getSelection();
  if (sel.getRangeAt && sel.rangeCount) {
    return sel.getRangeAt(0);
  }
  return null;
}

function restoreSelection(range) {
  if (range) {
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

document.addEventListener("mousedown", (event) => {
  popup.style.display = "none";


});
// 定义一个变量，用于记录当前被选中的列表项的索引
var selectedIndex = -1;
// 定义一个常量，用于存储列表项的id前缀
var ITEM_ID_PREFIX = "item-";
// 定义一个常量，用于存储列表项的总数
var ITEM_COUNT = popupList_Items.length;
// 定义一个常量，用于存储方向键的键码
var UP_KEY = 38;
var DOWN_KEY = 40;
var ENTER_KEY = 13;
// 当键盘在页面上按下时，执行以下函数
document.onkeydown = function (event) {

  if (popup.style.display === "none") {
    return;
  }
  // 获取按下的键的键码
  var keyCode = event.keyCode;
  // 判断按下的键是否是方向键或回车键
  if (keyCode === UP_KEY || keyCode === DOWN_KEY || keyCode === ENTER_KEY) {

    if(keyCode === UP_KEY || keyCode === DOWN_KEY){
       // 阻止默认的行为，例如滚动页面
    event.preventDefault();
    }
   
    // 如果按下的是上方向键
    if (keyCode === UP_KEY) {
      // 如果当前有被选中的列表项
      if (selectedIndex > -1) {
        // 移除当前被选中的列表项的样式
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.remove("selected");
        // 将索引减一，如果到达列表的开头，则跳转到列表的末尾
        selectedIndex = (selectedIndex - 1 + ITEM_COUNT) % ITEM_COUNT;
        // 添加新的被选中的列表项的样式
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.add("selected");
      } else {
        // 如果当前没有被选中的列表项，则默认选中第一个列表项
        selectedIndex = 0;
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.add("selected");
      }
    }
    // 如果按下的是下方向键
    if (keyCode === DOWN_KEY) {
      // 如果当前有被选中的列表项
      if (selectedIndex > -1) {
        // 移除当前被选中的列表项的样式
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.remove("selected");
        // 将索引加一，如果到达列表的末尾，则跳转到列表的开头
        selectedIndex = (selectedIndex + 1) % ITEM_COUNT;
        // 添加新的被选中的列表项的样式
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.add("selected");
      } else {
        // 如果当前没有被选中的列表项，则默认选中第一个列表项
        selectedIndex = 0;
        document.getElementById(ITEM_ID_PREFIX + selectedIndex).classList.add("selected");
      }
    }
    // 如果按下的是回车键
    if (keyCode === ENTER_KEY) {

      if(selectedIndex === -1){

        return;
      }
      event.preventDefault();
      // 如果当前有被选中的列表项
      if (selectedIndex > -1) {
        // 获取被选中的列表项的文本内容
        var text = document.getElementById(ITEM_ID_PREFIX + selectedIndex).textContent;
        // 将文本内容打印到控制台中
        console.log(text);

        popup.style.display = "none";

        if (selection_sta) {
          restoreSelection(selection_sta);
        }


        insertTextAtCaret(text);


      }
    }
  }
};