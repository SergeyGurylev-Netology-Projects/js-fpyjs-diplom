/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.imagePreviewElements = this.element.getElementsByClassName('image-preview-container');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.element.querySelector('.send-all').onclick = () => this.sendAllImages();
    this.element.querySelector('.close').onclick = () => this.close();
    this.element.querySelector('i.icon').onclick = () => this.close();

    this.element.querySelector('.content').onclick = e => {
      switch (e.target.tagName.toLowerCase()) {
        case 'input': {
          e.target.closest('.input').classList.remove('error')
          break
        }
        case 'button': {
          this.sendImage(e.target.closest('.image-preview-container'));
          break
        }
        case 'i': {
          this.sendImage(e.target.closest('.image-preview-container'));
          break
        }
      }
    };
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    const htmlArray = []
    images.forEach(image => htmlArray.push(this.getImageHTML(image)))
    this.element.querySelector('.content').innerHTML = htmlArray.join('')
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src='${item}' />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button"><i class="upload icon"></i></button>
        </div>
      </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    Array.from(this.imagePreviewElements).forEach(el => this.sendImage(el))
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const uploadPath = imageContainer.getElementsByTagName('input')[0].value.trim();
    if (!uploadPath) {
      imageContainer.querySelector('.input').classList.add('error')
      return
    }

    Yandex.uploadFile(uploadPath, escape(imageContainer.getElementsByTagName('img')[0].src), (res) => {
      if (res.error) {
        console.log(res)
        alert(res.message)
      } else {
        imageContainer.remove();
        if (!this.imagePreviewElements.length) this.close();
      }
    })
  }
}