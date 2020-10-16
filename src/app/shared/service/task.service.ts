import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private base_path: string = 'http://localhost:8080/api/tasks/';

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse){
    return throwError(error.message);
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base_path, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.base_path, JSON.stringify(task), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete(this.base_path+id, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(this.base_path+id, JSON.stringify(task), this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

}
