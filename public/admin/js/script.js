
//Upload images
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeButton = document.querySelector("[upload-image-remove]");
  const imagePreviewContainer = document.querySelector("[image-preview-container]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImagePreview.style.display = 'block'; // Show the preview
      removeButton.style.display = 'block'; // Show the "X" button
      imagePreviewContainer.style.display = 'block';

    }
  });
  removeButton.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImagePreview.style.display = 'none'; // Hide the preview
    removeButton.style.display = 'none'; // Hide the "X" button
    imagePreviewContainer.style.display = 'none';
    uploadImageInput.value = ""; // Clear the input field

  });
}
// End Upload images

//Deleted item
document.addEventListener("DOMContentLoaded", function () {
  const formDeleteItem = document.getElementById("form-delete-item");
  if (!formDeleteItem) return;

  const path = formDeleteItem.getAttribute("data-path");

  document.body.addEventListener("click", function (e) {
    const button = e.target.closest("[button-delete]");
    if (button) {
      const isConfirm = confirm("Bạn có chắc muốn xóa?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    }
  });
});

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]") //query to table chua item
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      });
    }
  }); 

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length; //count sl item checked
      if(countChecked === inputsId.length){
        inputCheckAll.checked = true;
      }
      else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//End checkbox Multi


const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0){
    let url = new URL(window.location.href);
    // console.log(url);

    buttonStatus.forEach(button => {
      button.addEventListener("click", () => {
        const status = button.getAttribute("button-status");

        if(status) {
          url.searchParams.set("status", status);
        } else {
          url.searchParams.delete("status");
        }
        // console.log(url.href);
        window.location.href = url.href
      })
    })
}
//End button status topics

//Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch){
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(e.target.elements.keyword.value);
    const keyword =  e.target.elements.keyword.value
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href
  });
}
//End Form Search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination){
  buttonPagination.forEach(button => {
    let url = new URL(window.location.href);
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href =  url.href; // chuyen huong den trang page hien tai
    });
  });
}
//End pagination



//Sort
const sort = document.querySelector("[sort]");
if(sort){
  let url = new URL(window.location.href);
  
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href =  url.href; 
  })
  //Sort clear
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href =  url.href; 
  })

  //Them selected cho option

  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if(sortKey && sortValue){
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected = true;
  }
//End Clear sort
}

//End Sort


//Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  // console.log(path);

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
//End change status

//Form Change Multi
const  formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  // console.log(formChangeMulti);
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked"); 

    const typeChange = e.target.elements.type.value;
    if(typeChange == "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những chủ đề này ?");

      if(!isConfirm){
        return;
      }
    }
    if(inputChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach(input => {
        const id = input.getAttribute("value");
        // const id = input.value

        if(typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        }else {
          ids.push(id);
        }
      });
      inputIds.value= ids.join(", ");
      formChangeMulti.submit();
    } 
  })
}
//End form change multi