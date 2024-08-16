import {Pipe, PipeTransform} from '@angular/core';

/**
 * A pipe that filters an array of strings based on a search text.
 *
 * @example
 * {{ items | textFilter: 'searchText' }}
 *
 * @param items The array of strings to filter.
 * @param searchText The search text to filter by.
 * @returns A new array of strings that match the search text.
 */
@Pipe({
    name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {

    /**
     * Transforms the input array of strings by filtering it based on the search text.
     *
     * @param items The array of strings to filter.
     * @param searchText The search text to filter by.
     * @returns A new array of strings that match the search text.
     */
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();
        items = items.filter(item => {
            return item.toLowerCase().includes(searchText);
        });
        return items;
    }

}