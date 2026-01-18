import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);            // Клонируем и сохраняем в root
        root.container.prepend(root[subName].container);   // Добавляем в начало контейнера
    });

    // Обрабатываем шаблоны, которые должны быть ПОСЛЕ таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);            // Клонируем и сохраняем в root
        root.container.append(root[subName].container);    // Добавляем в конец контейнера
    });
    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        // Вызываем onAction без аргументов
        onAction();
    });

    root.container.addEventListener('reset', () => {
        // Используем setTimeout, чтобы дождаться фактической очистки полей
        setTimeout(() => {
            onAction();
        });
    });

    root.container.addEventListener('submit', (e) => {
        // Предотвращаем перезагрузку страницы
        e.preventDefault();
        // Вызываем onAction и передаем кнопку (сабмиттер), которая инициировала отправку
        onAction(e.submitter);
    });

    root.container.addEventListener('reset', () => {
        // Используем setTimeout, чтобы дождаться, пока браузер очистит DOM-поля
        setTimeout(() => {
            // 3. Вызываем onAction без аргументов, чтобы перерисовать таблицу
            // Теперь она отобразит данные без учета фильтров
            onAction();
        });
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate)
            Object.keys(item).forEach(key => {
                // Проверяем, существует ли элемент с таким ключом в row.elements
                if (row.elements[key]) {
                    // Присваиваем текстовое содержимое из объекта item
                    const item_element = item[key];
                    row.elements[key].textContent = item_element;
                    //  console.log(row.elements[key]);
                    //console.log(item[key]);
                }

            });
            return row;
        });
        root.elements.rows.replaceChildren(...nextRows.map(row => row.container));
    }

    return { ...root, render };
}

