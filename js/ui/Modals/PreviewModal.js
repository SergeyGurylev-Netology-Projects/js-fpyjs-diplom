/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.imagePreviewElements = this.element.getElementsByClassName('image-preview-container');
    this.contentElement = this.element.querySelector('.content');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.element.querySelector('i.icon').onclick = () => this.close();

    this.contentElement.onclick = (e) => {
      if (e.target.classList.contains('delete') || e.target.classList.contains('trash')) {
        const btn = e.target.closest('.delete');
        const icon = btn.querySelector('.trash');

        btn.classList.add('disabled')
        icon.classList.add('spinner', 'loading')
        Yandex.removeFile(e.target.closest('.ui.delete').dataset.path, res => {
          if (!res) {
            e.target.closest('.image-preview-container').remove();
            if (!this.imagePreviewElements.length) this.close();
          } else {
            btn.classList.remove('disabled')
            icon.classList.remove('spinner', 'loading')
            alert(res.description)
          }
        })
      }

      if (e.target.classList.contains('download')) {
        Yandex.downloadFileByUrl(e.target.closest('.ui.download').dataset.file)
      }
    };
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    if (data.error) {
      console.log(data)
      alert(data.message)
      this.close()
    } else {
      const htmlArray = []
      data.items.forEach(item => {
        htmlArray.push(this.getImageInfo(item))
        // console.log(item)
      })
      this.contentElement.innerHTML = htmlArray.join('')
    }
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    return new Intl.DateTimeFormat('ru', {dateStyle: 'long', timeStyle: 'short'}).format(new Date(date));
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src='${item.preview}'/>
        <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
            <td>${item.name}</td>
            <td>${this.formatDate(item.created)}</td>
            <td>${Math.round(item.size/1024)}Кб</td>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>`
  }
}
