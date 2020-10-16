import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';
import { EditDialogComponent } from '../editDialog/edit-dialog/edit-dialog.component';

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
  updatedTask: Task;
  displayedColumns: string[] = ['created', 'name', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;

  constructor(private taskService: TaskService, public dialog: MatDialog) { 
    this.task = {} as Task;
    this.updatedTask = {} as Task;
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
        this.task.name=undefined;
      }
    );
  }
  deleteTask(id): void {
    this.taskService.deleteTask(id).subscribe(
      (response: any) => 
      {
        //filter el id
        this.dataSource.data = this.dataSource.data.filter((t: Task) => t.id !== id); //? t:false
      }
    );
  }
  updateTask(id): void {
    this.taskService.updateTask(id, this.updatedTask).subscribe((response: Task) => 
    {
      console.log(response);
      this.dataSource.data = this.dataSource.data.map((t: Task) => {
        if(t.id == response.id)
          t = response
        return t;
      });
    });

  }

  openDialog(task): void {
    this.updatedTask.name = task.name
    const dialogRef = this.dialog.open(EditDialogComponent, 
      {width: '250px', data: {
        name: this.updatedTask.name
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updatedTask.name = result;
        this.updateTask(task.id)
      }
    });
  }
  

}
