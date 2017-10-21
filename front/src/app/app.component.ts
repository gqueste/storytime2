import {Component, OnInit} from '@angular/core';
import {Tag} from './tag';
import {Character} from './character';
import {ApiService} from './api.service';

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
    styleUrls: ['./app.component.css'],
    providers: [ApiService]
})

//TODO Faire super méthode pour différencier Edit / Add
//TODO pour edit, améliorer backend pour prendre les autres paramètres que le nom
//TODO backend : tests pour POST et PUT characters avec tous les paramètres
//TODO pour edit, comparer les tags et appeler les méthodes de suppression ou d'ajout des tags
//TODO pour le POST et PUT Characters, gérer la liste des tags

export class AppComponent implements OnInit {

    constructor(private apiService: ApiService){
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
    characterIdToAdd = null;
    
    currentSelectedCharacter = null;

    editCharacterCurrentTags = [];
    editTagSearched = '';
    selectedEditTagIndex = 0;
    possibleEditTags: Tag[] = [];

    onCharacterSelect(element: Character): void {
        element.isActive = !element.isActive;
        this.currentSelectedCharacter = element;
    }

    ngOnInit(): void {
        this.apiService.getTags().then(data => {
            this.allTags = data['tags'];
        });
        this.apiService.getCharacters().then(data => {
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
                this.apiService.searchTags(value).then(data => {
                    this.possibleTags = data['tags'];
                });
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
        this.apiService.searchCharactersForCurrentTags(this.currentTags).then(data => {
            this.characters = data['characters'];
        });
    }

    onCurrentTagClick(tag: Tag) {
        this.currentTags = this.currentTags.filter(element => tag._id != element._id);
        this.apiService.searchCharactersForCurrentTags(this.currentTags).then(data => {
            this.characters = data['characters'];
        });
    }

    onResetTags() {
        this.currentTags = [];
        this.apiService.getCharacters().then(data => {
            this.characters = data['characters'];
        });
    }

    saveNewTag() {
        this.apiService.addTag(this.tagNameToAdd)
            .then(() => this.apiService.getTags())
            .then((data) => {
                this.allTags = data['tags'];
            })
        ;
    }

    saveNewCharacter() {
        this.apiService.addCharacter(this.characterNameToAdd, this.characterPhysiqueToAdd, this.characterMoraleToAdd, this.characterHistoireToAdd)
            .then((data) => {
                let insertAllTagsPromises = [];
                this.editCharacterCurrentTags.forEach((tag) => {
                    insertAllTagsPromises.push(this.apiService.insertTagForCharacter(tag, data['character']));
                });
                return Promise.all(insertAllTagsPromises);
            })
            .then(() => this.apiService.searchCharactersForCurrentTags(this.currentTags))
            .then(data => {
                //TODO alert ?
                this.characters = data['characters'];
                this.resetEditModal();
            })
        ;
    }

    resetEditModal() {
        this.possibleEditTags = [];
        this.editCharacterCurrentTags = [];
        this.selectedEditTagIndex = 0;
        this.editTagSearched = '';
        this.characterNameToAdd = '';
        this.characterPhysiqueToAdd = '';
        this.characterMoraleToAdd = '';
        this.characterHistoireToAdd = '';
    }

    onDeleteCharacterClick() {
        this.apiService.deleteCharacter(this.currentSelectedCharacter)
            .then(() => this.apiService.searchCharactersForCurrentTags(this.currentTags))
            .then(data => {
                //TODO alert ?
                this.characters = data['characters'];
            })
        ;
    }

    onPlusCharacterClick() {
        this.editCharacterCurrentTags = this.currentTags.slice();
        this.characterIdToAdd = null;
        this.characterNameToAdd = '';
        this.characterPhysiqueToAdd = '';
        this.characterMoraleToAdd = '';
        this.characterHistoireToAdd = '';
    }


    //TODO duplicated code
    onCurrentEditTagClick(tag: Tag) {
        this.editCharacterCurrentTags = this.editCharacterCurrentTags.filter(element => tag._id != element._id);
    }

    //TODO duplicated code
    onEditSearchKey(event: any) {
        if (event.keyCode === Keys.ARROW_RIGHT) {
            if (this.selectedEditTagIndex + 1 < this.possibleEditTags.length) {
                this.selectedEditTagIndex ++;
            }
        } else if (event.keyCode === Keys.ARROW_LEFT) {
            if (this.selectedEditTagIndex > 0) {
                this.selectedEditTagIndex --;
            }
        } else if (event.keyCode === Keys.ENTER) {
            if (this.possibleEditTags.length > 0) {
                const selectedTag = this.possibleEditTags[this.selectedEditTagIndex];
                this.onPossibleEditTagClick(selectedTag, null);
            }
        } else {
            let value = event.target.value;
            this.selectedEditTagIndex = 0;
            if (value === '') {
                this.possibleEditTags = [];
            } else {
                this.apiService.searchTags(value).then(data => {
                    this.possibleEditTags = data['tags'];
                });
            }
        }
    }

    //TODO duplicated code
    onPossibleEditTagClick(tag: Tag, event: any) {
        if(event === null || (event.clientX && event.clientX > 0)) { //workaround
            if(!this.editCharacterCurrentTags.find(element => element._id === tag._id)) {
                this.editCharacterCurrentTags.push(tag);
            }
            this.possibleEditTags = [];
            this.selectedEditTagIndex = 0;
            this.editTagSearched = '';
        }
    }

    onEditCharacterAddTag() {
        this.apiService.addTag(this.editTagSearched)
            .then(data => {
                this.editCharacterCurrentTags.push(data['tag']);
                this.possibleEditTags = [];
                this.selectedEditTagIndex = 0;
                this.editTagSearched = '';
                return this.apiService.getTags();
            })
            .then((data) => {
                this.allTags = data['tags'];
            })
        ;
    }

    onCharacterEditClick(character: Character) {
        this.characterIdToAdd = character['_id'];
        this.characterNameToAdd = character.name;
        this.characterPhysiqueToAdd = character.physique;
        this.characterMoraleToAdd = character.morale;
        this.characterHistoireToAdd = character.histoire;
        this.editCharacterCurrentTags = character.tags;
    }
}
