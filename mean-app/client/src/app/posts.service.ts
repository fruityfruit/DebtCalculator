import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Injectable()
export class PostsService {

  constructor(private http: HttpClient) { }

  // Get all posts from the API
  getAllPosts() {
    return this.http.get('/api/posts');
  }
}
