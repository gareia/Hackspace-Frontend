import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[]; /*= [
    {id: 1, name: 'jugaaar', completed: false, createdAt: null}
  ];*/

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response: any) => {this.tasks = response.content;}
    );
  }

}
