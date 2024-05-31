import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Category, CategoryResponse, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesServices {
  constructor(private http: HttpClient) {

  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:5000/category')
  }
  fetchAll(): Observable<Category> {
    return this.http.get<Category>('http://localhost:5000/category/all')
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`http://localhost:5000/category/${id}`)
  }

  create(name: string, description: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    fd.append('description', description)
    return this.http.post<Category>('http://localhost:5000/category', fd)
  }

  updateById(id: string | undefined, name: string, description: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
      console.log(image)
    }
    fd.append('name', name)
    fd.append('description', description)
    return this.http.patch<Category>(`http://localhost:5000/category/${id}`, fd)
  }

  deleteById(id: string): Observable<Message> {
    return this.http.delete<Message>(`http://localhost:5000/category/${id}`)
  }
}
