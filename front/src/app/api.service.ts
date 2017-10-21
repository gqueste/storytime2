import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Character} from './character';

import 'rxjs/Rx';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient){
    }

    getTags() {
        return this.http.get('http://localhost:3000/api/v1/tags').toPromise();
    }

    getCharacters() {
        return this.http.get('http://localhost:3000/api/v1/characters').toPromise();
    }

    addCharacter(name: string, physique: string, morale: string, histoire: string) {
        let character = {
            name,
            physique,
            morale,
            histoire
        };
        return this.http.post('http://localhost:3000/api/v1/characters', character).toPromise();
    }

    deleteCharacter(character: Character) {
        return this.http.delete('http://localhost:3000/api/v1/characters/'+character._id).toPromise();
    }

    searchTags(search: string) {
        return this.http.get('http://localhost:3000/api/v1/tags?title='+search).toPromise();
    }

    addTag(title: string) {
        let tag = {
            title
        };
        return this.http.post('http://localhost:3000/api/v1/tags', tag).toPromise();
    }

    searchCharactersForCurrentTags(currentTags) {
        let tagsIdList = "";
        currentTags.forEach((tag, index) => {
            let str = "tagId=" + tag._id;
            if (index < currentTags.length -1 ) {
                str += "&";
            }
            tagsIdList += str;
        });
        return this.http.get('http://localhost:3000/api/v1/characters?'+tagsIdList).toPromise();
    }
}