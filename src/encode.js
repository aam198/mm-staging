
const dropArea = document.getElementById("drop-area");
const dragArea = document.querySelector(".drag-area");
const dragText = document.getElementById("select-file");
const browseBtn = document.getElementById("browse-btn");
const icon = document.querySelector("icon");
const fileElem = document.getElementById("fileElem");
const addedFiles = document.querySelector("#addedFiles");

const encodeBtn = document.getElementById("encodeBtn");
const modal = document.getElementById("myModal");
const modalClose = document.getElementsByClassName("close") [0];
const backBtn = document.getElementById("backBtn");



function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dragArea.classList.add("active");
  dragText.textContent = "Select File to Encode";
}

function unhighlight(e) {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop Assets to be Encoded";
}

function handleDrop(e) {
  const dt = e.dataTransfer
  const files = dt.files

  handleFiles(files)
}


// Progress Bar when uploading files

let uploadProgress = [];
let progressBar = document.getElementById('progress-bar');

function initializeProgress(numFiles) {
  progressBar.value = 0;
  uploadProgress = [];

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent;
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  console.debug('update', fileNumber, percent, total);
  progressBar.value = total;
  //add in toast notification below for 100 percent complete
  if (progressBar.value == 100){
    dragText.textContent = "Drag & Drop Assets to be Encoded";
  }
}

// When files are chosen
function handleFiles(files) {
  files = [...files]
  initializeProgress(files.length);
  dragText.textContent = "Drag & Drop Assets to be Encoded";
  // files.forEach(uploadFile); 
  files.forEach(listFile);
  if(files.length <= 0){
    encodeBtn.setAttribute("disabled", "");
  }
  else {
    encodeBtn.removeAttribute("disabled");
  }
}

// function uploadFile(file, i) {
//   const url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload';
//   const xhr = new XMLHttpRequest();
//   const formData = new FormData();
//   xhr.open('POST', url, true);
//   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

//   // Update progress (can be used to show progress indicator)
//   xhr.upload.addEventListener("progress", function(e) {
//     updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
//   });

//   xhr.addEventListener('readystatechange', function(e) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       updateProgress(i, 100) // <- Add this
//     }
//     else if (xhr.readyState == 4 && xhr.status != 200) {
//       // Error. Inform the user
//     }
//   });

//   formData.append('upload_preset', 'ujpu6gyk');
//   formData.append('file', file);
//   xhr.send(formData);
// }


function listFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  
    dragArea.classList.remove("active");
    const fileDetails = document.getElementById('fileDetails');
    const fileList= document.createElement('div');
    const listItem = document.createElement('div');
    const checkboxContain = document.createElement('label');
    const inputCheck = document.createElement('input');
    const checkmark = document.createElement('span');
    const listText = document.createElement('span');
    const close = document.createElement('i');
    
    const size = file.size;
    const file_name_string = file.name;
    const file_name_array = file_name_string.split(".");
    console.log(file_name_array);
    const file_name= file_name_array[0];
    const file_type = file_name_array[file_name_array.length-1];

    
    const file_byte = new Array('Bytes', 'KB', 'MB', 'GB');
    let fSize = size;
    var i=0;
     while(fSize>900){fSize/=1024;i++;}

    const file_size = (Math.round(fSize*100)/100)+' '+file_byte[i];

    let  nodesString = "";

    nodesString += "<div class='file-location'>" + "</div>" + "<div class='file-name'>" + file_name + "</div>"  +"<div class='file-type'>" + file_type + "</div>" + "<div class='file-size'>" + file_size + "</div>" ; 
   
    fileList.classList.add('fadeIn');
    fileList.classList.add('fileList');
    listItem.classList.add('verify');
    checkboxContain.classList.add('checkbox-container');
    inputCheck.type="checkbox";
    checkmark.classList.add('checkmark');

    fileDetails.appendChild(fileList);
    fileList.appendChild(listItem);
    listItem.appendChild(checkboxContain);
    checkboxContain.appendChild(inputCheck);
    checkboxContain.appendChild(checkmark);
    fileList.innerHTML += nodesString;

     
    fileList.appendChild(close);
    close.className="fas fa-times remove";

    console.log(size);
    console.log(fileDetails.childNodes.length);
    close.addEventListener("click", () =>{
      setTimeout(function(){
        console.log(fileDetails.childNodes.length);
        if(fileDetails.firstChild) {
          fileList.remove(fileList.firstChild);
        }
        if(fileDetails.childNodes.length < 2){
          encodeBtn.setAttribute("disabled", "")
        }
       }, 1000);
       fileList.classList.remove('fadeIn');
       fileList.classList.add('fadeOut');
    });

}

//Event Listeners

//Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
});


// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
});

browseBtn.addEventListener("click", () => {
  fileElem.click();
  highlight();
});


// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

//If user Drag File Over DropArea
dragArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //Prevents default behavior 
  dragArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dragArea.addEventListener("dragleave", ()=>{
  dragArea.classList.remove("active");
  dragText.textContent = "Drag & Drop Assets to be Encoded";
});


// Open Modal
encodeBtn.addEventListener("click", () => {
  modal.style.display = "block";
});
 
 modalClose.addEventListener("click", () => {
  modal.style.display = "none";
 });

 backBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
 
 window.onclick = function (event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
 }

//  End of Modal

