import {rules, createComparison} from "../lib/compare.js";
//import { filterData } from "../lib/filter.js"; // Убедитесь, что импортировали функцию фильтрации
//import { skipEmptyTargetValues } from "../lib/compare.js"; // Проверьте путь к этому правилу

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const comparator = createComparison([], 
        [
        rules.skipEmptyTargetValues(searchField),
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
       // console.log(comparator);
      return  comparator;
      
    }
}