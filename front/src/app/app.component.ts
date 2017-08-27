import {Component} from '@angular/core';
import {Tag} from './tag';
import {Character} from './character';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'StoryTime';
    characters: Character[] = [
        {
            _id: '1',
            name: 'Christian',
            tags: [
                {
                    _id: '1',
                    title: 'Pouvoir de mort'
                },
                {
                    _id: '2',
                    title: 'Famille 1'
                }
            ]
        },
        {
            _id: '2',
            name: 'Toto',
            tags: []
        },
        {
            _id: '3',
            name: 'Batman',
            tags: [
                {
                    _id: '1',
                    title: 'Pouvoir de mort'
                }
            ]
        }
    ];
    possibleTags: Tag[] = [
        {
            _id: '1',
            title: 'Pouvoir de mort'
        },
        {
            _id: '2',
            title: 'Famille 1'
        }
    ];
    currentTags: Tag[] = [
        {
            _id: '1',
            title: 'Pouvoir de mort'
        },
        {
            _id: '2',
            title: 'Famille 1'
        }
    ];

    onCharacterSelect(element: Character): void {
        console.log("viewing character");
        console.log(element);
    }
}
