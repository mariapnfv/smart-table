export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action && action.name === 'clear') {
            // 1. Находим input рядом с кнопкой (ищем внутри общего родителя)
            const fieldName = action.dataset.field;
            // const parent = action.parentElement;
            const input = action.parentElement.querySelector('input, select');

            if (input) {
                // 2. Сбрасываем визуальное значение в поле ввода
                input.value = '';
            }

            // 3. Получаем имя поля из атрибута data-field кнопки

            if (fieldName in state) {
                // 4. Сбрасываем значение этого поля в объекте состояния (state)
                state[fieldName] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}

