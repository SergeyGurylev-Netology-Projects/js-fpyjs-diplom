/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    this.element.querySelectorAll('.replace, .add').forEach(el => {
      el.addEventListener('click', (e) => {
        const userIdElement = this.element.getElementsByTagName('input')[0];
        const userId = userIdElement.value.trim();
        if (!userId) return;

        if (e.currentTarget.classList.contains('replace')) App.imageViewer.clear();
        VK.get(userId, App.imageViewer.drawImages);

        userIdElement.value = '';
      })
    })
  }
}
