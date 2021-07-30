const fileUploader = document.body.querySelector('.file-uploader');

function hideFileUploader() {
	fileUploader.style.display = 'none';
}

const addFileButton = document.body.querySelector('.file-uploader__add-file-button');

addFileButton.addEventListener('click', () => {
	const fileInput = document.createElement('input');
	fileInput.setAttribute('type', 'file');
	fileInput.setAttribute('multiple', '');
	fileInput.setAttribute('accept', 'image/*');

	fileInput.addEventListener('change', event => {
		const files = event.target.files;
		const numberOfFiles = files.length;

		if(numberOfFiles >= 2 && numberOfFiles <= 5) {
			showFiles(Array.from(files));
		}
		else {
			showErrorPopup();
		}
	});

	fileInput.click();
});


const errorPopupWrapper = document.body.querySelector('.error-popup-wrapper');
const errorPopupCloseButton = document.body.querySelector('.error-popup__close-button');
const errorPopupOkButton = document.body.querySelector('.error-popup__ok-button');

errorPopupCloseButton.addEventListener('click', () => {
	hideErrorPopup();
});

errorPopupOkButton.addEventListener('click', () => {
	hideErrorPopup();
});

function showErrorPopup() {
	errorPopupWrapper.style.display = 'flex';
}

function hideErrorPopup() {
	errorPopupWrapper.style.display = 'none';
}


const fileViewer = document.body.querySelector('.file-viewer');

let draggableFileElement = undefined;

function drawFile(file, data) {
	const fileElement = document.createElement('div')
	fileElement.setAttribute('class', 'file-viewer__file');
	fileElement.setAttribute('draggable', 'true');

	fileElement.ondragstart = event => {
		const dataTransfer = event.dataTransfer;

		event.dataTransfer.setData('text', file.name);
		draggableFileElement = fileElement;

		draggableFileElement.style.opacity = '0.5'
	};

	fileElement.ondragend = event => {
		draggableFileElement.style.opacity = '1'
	};

	fileElement.ondragover = fileElement.ondragenter = event => {
		event.returnValue = false;
		event.preventDefault();
	}

	fileElement.ondrop = event => {
		event.returnValue = false;
		event.preventDefault();

		if(draggableFileElement != fileElement) {
			const children = Array.from(fileElement.parentNode.children);
			const fileElementIndex = children.findIndex(child => child === fileElement);

			if(draggableFileElement == children[fileElementIndex - 1]) {
				draggableFileElement.parentNode.insertBefore(draggableFileElement, children[fileElementIndex + 1]);
			}
			else {
				if(fileElementIndex < children.length - 1) {
					draggableFileElement.parentNode.insertBefore(draggableFileElement, fileElement);
				}
				else {
					draggableFileElement.parentNode.insertBefore(draggableFileElement, null);
				}
			}
		}
	};

	{
		const filePreviewElement = document.createElement('div')
		filePreviewElement.setAttribute('class', 'file-viewer__file-preview');

		const img = new Image();
		img.src = data;
		filePreviewElement.appendChild(img);

		fileElement.appendChild(filePreviewElement);
	}

	{
		const fileNameElement = document.createElement('div')
		fileNameElement.setAttribute('class', 'file-viewer__file-name');
		fileNameElement.setAttribute('title', file.name);
		fileNameElement.appendChild(document.createTextNode(file.name));

		fileElement.appendChild(fileNameElement);
	}

	fileViewer.appendChild(fileElement);
}

function showFiles(files) {
	hideErrorPopup();
	hideFileUploader();

	fileViewer.style.display = 'flex';

	files.forEach(file => {
		const reader = new FileReader();

		reader.onload = event => {
			drawFile(file, event.target.result);
		}

		reader.readAsDataURL(file);
	});
}