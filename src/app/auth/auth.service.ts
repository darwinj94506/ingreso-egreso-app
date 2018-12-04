import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import * as firebase from 'firebase';
import{map} from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth,
    private router:Router,private afDB:AngularFirestore) { }

  initAuthListener(){
    this.afAuth.authState.subscribe((fbUser:firebase.User) =>{
      console.log(fbUser);
    })
  }
  crearUsuario(nombre:string,email:string,password:string){
    this.afAuth.auth.
      createUserWithEmailAndPassword(email,password)
      .then(user=>{
        const usuario:User={
          uid:user.user.uid,
          nombre:nombre,
          email:user.user.email
        };
        this.afDB.doc(`${usuario.uid}/usuario`)
          .set(usuario).then(()=>{
            this.router.navigate(['/']);
          })

      }).catch(error=>{
        // console.log(error);
        Swal('Error en el login',error.message,'error');

      });
  }

  login(email:string, password:string){
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
    .then(user=>{
      // console.log(user);
      this.router.navigate(['/']);

    }).catch(error=>{
      console.log(error);
      Swal('Error en el login',error.message,'error');
    });
  }
  logout(){
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.afAuth.authState
        .pipe(
          map(fbUser=>{
            if(fbUser==null){
              this.router.navigate(['/login']);
            }
            return fbUser!=null; //devuelve un true o un false
          }) 
        );
  }
}
