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

    selectedTagIndex = 0;
    title = 'StoryTime';
    tagSearched: string = '';
    allTags = [];
    tagNameToAdd = '';
    characters: Character[] = [];
    possibleTags: Tag[] = [];
    currentTags: Tag[] = [];

    characterNameToAdd = '';
    characterPhysiqueToAdd = '';
    characterMoraleToAdd = '';
    characterHistoireToAdd = '';

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
    
    addTag(title: string) {
        let tag = {
            title
        };
        this.http.post('http://localhost:3000/api/v1/tags', tag).subscribe(data => {
            //TODO alert ?
            this.getTags();
        });
    }

    addCharacter(name: string, physique: string, morale: string, histoire: string) {
        let character = {
            name,
            physique,
            morale,
            histoire
        };
        this.http.post('http://localhost:3000/api/v1/characters', character).subscribe(data => {
            //TODO alert ?
            this.getCharacters();
        });
    }

    searchCharactersForCurrentTags(): void {
        let tagsIdList = "";
        this.currentTags.forEach((tag, index) => {
            let str = "tagId=" + tag._id;
            if (index < this.currentTags.length -1 ) {
                str += "&";
            }
            tagsIdList += str;
        });
        this.http.get('http://localhost:3000/api/v1/characters?'+tagsIdList).subscribe(data => {
            this.characters = data['characters'];
        });
    }

    onSearchKey(event: any) {
        if (event.keyCode === Keys.ARROW_RIGHT) {
            if (this.selectedTagIndex + 1 < this.possibleTags.length) {
                this.selectedTagIndex ++;
            }
        } else if (event.keyCode === Keys.ARROW_LEFT) {
            if (this.selectedTagIndex > 0) {
                this.selectedTagIndex --;
            }
        } else if (event.keyCode === Keys.ENTER) {
            if (this.possibleTags.length > 0) {
                const selectedTag = this.possibleTags[this.selectedTagIndex];
                this.onPossibleTagClick(selectedTag);
            }
        } else {
            let value = event.target.value;
            this.selectedTagIndex = 0;
            if (value === '') {
                this.possibleTags = [];
            } else {
                this.searchTags(value);
            }
        }
    }

    onPossibleTagClick(tag: Tag) {
        if(!this.currentTags.find(element => element._id === tag._id)) {
            this.currentTags.push(tag);
        }
        this.possibleTags = [];
        this.selectedTagIndex = 0;
        this.tagSearched = '';
        this.searchCharactersForCurrentTags();
    }

    onCurrentTagClick(tag: Tag) {
        this.currentTags = this.currentTags.filter(element => tag._id != element._id);
        this.searchCharactersForCurrentTags();
    }

    onResetTags() {
        this.currentTags = [];
        this.getCharacters();
    }

    saveNewTag() {
        this.addTag(this.tagNameToAdd);
    }

    saveNewCharacter() {
        this.addCharacter(this.characterNameToAdd, this.characterPhysiqueToAdd, this.characterMoraleToAdd, this.characterHistoireToAdd);
    }
}
