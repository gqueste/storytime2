import {Component, OnInit} from '@angular/core';
import {Tag} from './tag';
import {Character} from './character';
import {HttpClient} from "@angular/common/http";

const Keys = {
    ENTER: 13,
    A: 65,
    Z: 90,
    BACKSPACE: 8,
    ARROW_RIGHT: 39,
    ARROW_LEFT: 37
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private http: HttpClient){
    }


    title = 'StoryTime';
    tagSearched: string = '';
    allTags = [];
    characters: Character[] = [];
    possibleTags: Tag[] = [];
    currentTags: Tag[] = [];

    onCharacterSelect(element: Character): void {
        element.isActive = !element.isActive;
    }

    ngOnInit(): void {
        this.getTags();
        this.getCharacters();
    }

    getTags(): void {
        this.http.get('http://localhost:3000/api/v1/tags').subscribe(data => {
            this.allTags = data['tags'];
        });
    }

    getCharacters(): void {
        this.http.get('http://localhost:3000/api/v1/characters').subscribe(data => {
            this.characters = data['characters'];
        });
    }

    searchTags(search: string): void {
        console.log(search);
        this.http.get('http://localhost:3000/api/v1/tags?title='+search).subscribe(data => {
            this.possibleTags = data['tags'];
        });
    }

    isValidForSearch(key) {
        return (key >= Keys.A && key <= Keys.Z) || key === Keys.BACKSPACE;
    }

    onSearchKey(event: any) {
        console.log(event.keyCode);
        //TODO arrowKeys select the correct Tag
        if (event.keyCode === Keys.ENTER) {
            console.log('ENTER PRESSED');
            if (this.possibleTags.length > 0) {
                const selectedTag = this.possibleTags[0];
                if(!this.currentTags.find(element => element._id === selectedTag._id)) {
                    this.currentTags.push(selectedTag);
                }
                this.possibleTags = [];
                this.tagSearched = '';
            }
        } else if (this.isValidForSearch(event.keyCode)) {
            let value = event.target.value;
            if (value === '') {
                this.possibleTags = [];
            } else {
                this.searchTags(value);
            }
        }
    }
}
