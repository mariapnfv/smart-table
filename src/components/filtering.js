import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes) // Получаем ключи (например, 'category', 'status')
  .forEach((elementName) => { // Перебираем соответствующие select-элементы
    elements[elementName].append(
      ...Object.values(indexes[elementName]) // Получаем массив уникальных значений для этого поля
        .map(name => {
          // Создаем элемент <option>
          const option = document.createElement('option');
          // Устанавливаем значение и текст (они совпадают)
          option.value = name;
          option.textContent = name;
          
          return option; // Возвращаем готовую опцию в массив для append
        })
    );
  });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
if (action && action.name === 'clear') {
    // 1. Находим input рядом с кнопкой (ищем внутри общего родителя)
    const input = action.parentElement.querySelector('input');
    
    if (input) {
        // 2. Сбрасываем визуальное значение в поле ввода
        input.value = '';
        
        // 3. Получаем имя поля из атрибута data-field кнопки
        const fieldName = action.dataset.field;
        
        // 4. Сбрасываем значение этого поля в объекте состояния (state)
        // В зависимости от структуры вашего проекта это может быть state[fieldName] или state.filters[fieldName]
        state.filters[fieldName] = ''; 
    }
}
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
     //   return data;
    }
}