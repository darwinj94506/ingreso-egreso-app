import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import * as firebase from 'firebase';
import{map} from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction,DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription:Subscription=new Subscription();
  

  constructor(public afAuth: AngularFireAuth,private store:Store<AppState>,
    private router:Router,private afDB:AngularFirestore) { }

  initAuthListener(){
    this.afAuth.authState.subscribe((fbUser:firebase.User) =>{
      if(fbUser){
        this.userSubscription=this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
                .subscribe((usuarioObj:any)=>{
                  const newUser=new User(usuarioObj);
                  this.store.dispatch( new SetUserAction(newUser) );

                })
      }else{
        this.userSubscription.unsubscribe();
      }
    })
  }
  crearUsuario(nombre:string,email:string,password:string){
    
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.
      createUserWithEmailAndPassword(email,password)
      .then(user=>{
        const usuario:User={
          uid:user.user.uid,
          nombre:nombre,
          email:user.user.email
        };
        this.afDB.doc(`${usuario.uid}/usuario`)
          .set(usuario)
          .then(()=>{
            this.router.navigate(['/']);
            this.store.dispatch(new DesactivarLoadingAction());

          })

      }).catch(error=>{
        // console.log(error);
        this.store.dispatch(new DesactivarLoadingAction());

        Swal('Error en el login',error.message,'error');

      });
  }

  login(email:string, password:string){
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
    .then(user=>{
      // console.log(user);
      this.router.navigate(['/']);

    }).catch(error=>{
      this.store.dispatch(new DesactivarLoadingAction());
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
