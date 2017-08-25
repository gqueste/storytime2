import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    characters = [
        {
            name: 'Christian',
            tags: [
                {
                    title: 'Pouvoir de mort'
                },
                {
                    title: 'Famille 1'
                }
            ]
        },
        {
            name: 'Toto'
        },
        {
            name: 'Batman',
            tags: [
                {
                    title: 'Pouvoir de mort'
                }
            ]
        }
    ];
}
