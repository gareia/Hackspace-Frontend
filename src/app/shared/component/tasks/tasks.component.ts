import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  /*tasks: Task[];= [
    {id: 1, name: 'jugaaar', completed: false, createdAt: null}
  ];*/
  task: Task;
  displayedColumns: string[] = ['created', 'name', 'delete'];
  dataSource = new MatTableDataSource();
  overDelete: Boolean = false;

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;

  constructor(private taskService: TaskService) { 
    this.task = {} as Task;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getTasks();
  }

  //response.content just data | response includes pagination
  getTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response: any) => {this.dataSource.data = response.content;}
    );
  }
  createTask(): void {
    //this.tasks.push(this.task);
    this.taskService.createTask(this.task).subscribe(
      (response: Task) => 
      { 
        this.dataSource.data.push({...response});
        this.dataSource.data = this.dataSource.data.map(t => t);
      }
    );

  }
  deleteTask(id): void {
    
    this.taskService.deleteTask(id).subscribe(
      (response: any) => 
      {
        //filter el id
        this.dataSource.data = this.dataSource.data.filter((t: Task) => t.id !== id);
      }
    );

  }
  

}
