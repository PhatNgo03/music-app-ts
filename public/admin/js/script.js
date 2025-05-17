
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