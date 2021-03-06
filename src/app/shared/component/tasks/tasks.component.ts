import { SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
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
  displayedColumnsUncomplTasks: string[] = ['select', 'created', 'name', 'actions'];
  displayedColumnsComplTasks: string[] = ['created', 'name', 'actions'];
  tasksCompleted = new MatTableDataSource();
  tasksUncompleted = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;

  constructor(private taskService: TaskService, public dialog: MatDialog) { 
    this.task = {} as Task;
    this.updatedTask = {} as Task;
  }

  ngOnInit(): void {
    this.tasksCompleted.paginator = this.paginator; //is this ok????
    this.tasksUncompleted.paginator = this.paginator;
    this.getTasks();
  }

  //response.content just data | response includes pagination
  getTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response: any) => {
        this.tasksUncompleted.data = response.content;
        this.tasksCompleted.data = response.content;
        this.tasksUncompleted.data = this.tasksUncompleted.data.filter((t: Task) => t.completed == false);
        this.tasksCompleted.data = this.tasksCompleted.data.filter((t: Task) => t.completed == true);
      }
    );
  }
  createTask(): void {
    this.taskService.createTask(this.task).subscribe(
      (response: Task) => 
      { 
        this.tasksUncompleted.data.push({...response});
        this.tasksUncompleted.data = this.tasksUncompleted.data.map(t => t);
        this.task.name=undefined;
      }
    );
  }
  deleteTask(id, isCompleted): void {
    this.taskService.deleteTask(id).subscribe(
      (response: any) => 
      {
        if(isCompleted){
          this.tasksCompleted.data = this.tasksCompleted.data.filter((t: Task)=> t.id !== id);//por mientras
        }else{
          this.tasksUncompleted.data = this.tasksUncompleted.data.filter((t: Task) => t.id !== id); //? t:false
        }
      }
    );
  }
  deleteDialog(task: Task): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {data:{action: "eliminar"}}
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteTask(task.id, task.completed);
      }
    });
  }

  updateTask(id): void { 
    this.taskService.updateTask(id, this.updatedTask).subscribe((response: Task) => 
    {
      console.log(response);
      if(response.completed == true){
        this.tasksUncompleted.data = this.tasksUncompleted.data.filter((t: Task) => t.id != id);
        this.tasksCompleted.data.push({...response});
        this.tasksCompleted.data = this.tasksCompleted.data.map(t => t);
      }else{
        this.tasksUncompleted.data = this.tasksUncompleted.data.map((t: Task) => {
          if(t.id == response.id)
            t = response
          return t;
        });
      }
    });
  }
  editDialog(task: Task): void {
    this.updatedTask.name = task.name;
    this.updatedTask.completed = task.completed;
    const dialogRef = this.dialog.open(EditDialogComponent, 
      {width: '250px', data: { name: this.updatedTask.name }}
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updatedTask.name = result;
        this.updateTask(task.id)
      }
    });
  }
  checkDialog(task: Task, event): void{
    //this.selection.toggle(task);
    this.selection.select(task);
    
    if(this.selection.isSelected(task)){
      this.updatedTask.name = task.name;
      this.updatedTask.completed = true;
      const dialogRef = this.dialog.open(ConfirmDialogComponent,
        {data:{action: "haber terminado"}}
      );
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.updateTask(task.id);
        }else{
          this.selection.deselect(task);
        }
      });
    }
  }

}
