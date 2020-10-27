import { SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
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
  displayedColumns: string[] = ['select', 'created', 'name', 'actions'];
  //dataSource = new MatTableDataSource();
  //tasksCompleted = new MatTableDataSource();
  tasksIncompleted = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;

  constructor(private taskService: TaskService, public dialog: MatDialog) { 
    this.task = {} as Task;
    this.updatedTask = {} as Task;
  }

  ngOnInit(): void {
    //this.tasksCompleted.paginator = this.paginator;
    this.tasksIncompleted.paginator = this.paginator;
    this.getTasks();
  }


  //response.content just data | response includes pagination
  getTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response: any) => {
        this.tasksIncompleted.data = response.content;
        this.tasksIncompleted.data = this.tasksIncompleted.data.filter((t: Task) => t.completed == false);
      
      }
    );
   
  }
  createTask(): void {
    this.taskService.createTask(this.task).subscribe(
      (response: Task) => 
      { 
        this.tasksIncompleted.data.push({...response});
        this.tasksIncompleted.data = this.tasksIncompleted.data.map(t => t);
        this.task.name=undefined;
      }
    );
  }
  deleteTask(id): void {
    this.taskService.deleteTask(id).subscribe(
      (response: any) => 
      {
        this.tasksIncompleted.data = this.tasksIncompleted.data.filter((t: Task) => t.id !== id); //? t:false
      }
    );
  }
  updateTask(id): void { //2dialog para confirmar update y delete 3mostrar checkeados
    this.taskService.updateTask(id, this.updatedTask).subscribe((response: Task) => 
    {
      console.log(response);
      if(response.completed == true){
        this.tasksIncompleted.data = this.tasksIncompleted.data.filter((t: Task) => t.id != id);
      }else{
        this.tasksIncompleted.data = this.tasksIncompleted.data.map((t: Task) => {
          if(t.id == response.id)
            t = response
          return t;
        });
      }
    });
  }
  openDialog(task: Task): void {
    console.log(task);
    this.updatedTask.name = task.name;
    this.updatedTask.completed = task.completed;
    const dialogRef = this.dialog.open(EditDialogComponent, 
      {width: '250px', data: {
        name: this.updatedTask.name
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updatedTask.name = result;
        console.log(this.updatedTask);
        this.updateTask(task.id)
      }
    });
  }
  checkTask(task: Task): void{
    this.selection.isSelected(task);
    this.updatedTask.name = task.name;
    this.updatedTask.completed = true;
    console.log('what is being sent', this.updatedTask);
    this.updateTask(task.id);
  }

  

}
