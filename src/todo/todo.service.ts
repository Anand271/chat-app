import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  private todos: any[] = []; // Local array to store todos

  create(createTodoDto: CreateTodoDto) {
    const newTodo = {
      ...createTodoDto,
      id: this.todos.length + 1, // Generate ID (just for example; replace with UUID or actual ID logic)
    };
    this.todos.push(newTodo);
    console.log(newTodo);
    return newTodo; // Return the newly created todo
  }

  findAll() {
    return this.todos; // Return all todos
  }

  findOne(id: number) {
    return this.todos.find(todo => todo.id === id); // Find a todo by ID
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return null; // If todo not found, return null or handle accordingly
    }
    // Update todo
    this.todos[index] = {
      ...this.todos[index],
      ...updateTodoDto,
    };
    return this.todos[index]; // Return updated todo
  }

  remove(id: number) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return null; // If todo not found, return null or handle accordingly
    }
    const removedTodo = this.todos.splice(index, 1)[0]; // Remove todo from array
    return removedTodo; // Return removed todo
  }
}
