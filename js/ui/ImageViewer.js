/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.imagesListGrid = element.querySelector('.grid');
    this.imageElements = this.imagesListGrid.getElementsByTagName('img');
    this.imagePreviewElement = element.querySelector('.fluid');
    this.srcNoImageFound = this.imagePreviewElement.src;
    this.selectAllBtn = this.element.querySelector('.select-all');
    this.sendBtn = this.element.querySelector('.send');
    this.showUploadedBtn = this.element.querySelector('.show-uploaded-files');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    this.imagesListGrid.addEventListener('click',e => {
      const self = this;
      if (e.target.tagName.toLowerCase() === 'img') {
        if (e.target.getAttribute('clicks') === null) {
          e.target.setAttribute('clicks', '1');
          setTimeout(function () {
            if (e.target.getAttribute('clicks') === '1') {
              // single click
              e.target.classList.toggle('selected');
              self.checkButtonText();
            }
            e.target.removeAttribute('clicks');
          }, 300)
        } else {
          // double click
          this.imagePreviewElement.src = e.target.src;
          e.target.removeAttribute('clicks');
        }
      }

      // Обработчик двойного клика реализован в обработчике дного клика,
      // т.к. эти обработчики всегда вызываются оба при двойном клике
      // this.imagesListGrid.addEventListener('dblclick', e => {
      //   if (e.target.tagName.toLowerCase() === 'img') {
      //     this.imagePreviewElement.src = e.target.src;
      //   }
      // });

      if (e.target === this.selectAllBtn) {
        Array.from(this.imageElements).forEach(el => {
          if (this.selectAllBtn.innerText.toLowerCase().includes('выбрать')) {
            el.classList.add('selected')
          } else {
            el.classList.remove('selected')
          }
        });
        this.checkButtonText();
      }

      if (e.target === this.sendBtn) {
        const fileUploader = App.getModal('fileUploader')
        const selectedImages = Array.from(this.imageElements).
            filter(el => el.classList.contains('selected')).
            map(function (el) {
              return el.src
            })

        fileUploader.open()
        fileUploader.showImages(selectedImages)
      }

      if (e.target === this.showUploadedBtn) {
        const filePreviewer = App.getModal('filePreviewer')

        filePreviewer.open()
        Yandex.getUploadedFiles(data => filePreviewer.showImages(data));
      }
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesListGrid.querySelectorAll('.image-wrapper').forEach(el => {
      el.remove();
    })

    this.imagePreviewElement.src = this.srcNoImageFound;

    this.checkButtonText();
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    images.forEach(image => {
      if (urlExists(image.url) && !Array.from(this.imageElements).find(e => e.dataset.id == image.id)) {
        this.imagesListGrid.insertAdjacentHTML(
            'beforeend',
            `<div class='four wide column ui medium image-wrapper'><img data-id='${image.id}' src='${image.url}'/></div>`
        )
      }
    })

    this.checkButtonText();

    function urlExists(url) {
      // Почему-то из ВК иногда приходят файлы с битыми ссылками

      const http = new XMLHttpRequest();
      http.open('HEAD', url, false);
      http.send();
      return http.status != 404;
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    if (this.imageElements.length) {
      this.selectAllBtn.classList.remove('disabled')
    } else {
      this.selectAllBtn.classList.add('disabled')
    }

    if (Array.from(this.imageElements).find(el => el.classList.contains('selected'))) {
      this.sendBtn.classList.remove('disabled');
      this.selectAllBtn.innerText = 'Снять выделение';
    } else {
      this.sendBtn.classList.add('disabled');
      this.selectAllBtn.innerText = 'Выбрать всё';
    }
  }
}
