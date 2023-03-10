import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product ,cart} from '../data-type';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData:undefined|product;
  productQuantity:number=1;
  removeCart=false;
  cartData:product|undefined;
  productId: any ;
  constructor( private activeRoute:ActivatedRoute,private product :ProductService){}
ngOnInit(): void {
  this.productId=this.activeRoute.snapshot.paramMap.get('productId');
  this.product.getProduct(this.productId).subscribe((res)=>{
    if(res){ 
    this.productData=res;
    console.log(this.productId);
    
    }
  })
  let cartData = localStorage.getItem('localCart');
  if(this.productId && cartData){
    let items = JSON.parse(cartData);
    items = items.filter((item:product)=>this.productId=== item.id.toString());
    if(items.length){
      this.removeCart=true
    }else{
      this.removeCart=false
    }
  }
}
handleQuantity(val:string){
  if(this.productQuantity<20 && val==='plus'){
    this.productQuantity+=1;
  }else if(this.productQuantity>1 && val==='min'){
    this.productQuantity-=1;
  }
}
AddToCart(){
  if(this.productData){
    this.productData.quantity = this.productQuantity;
    if(!localStorage.getItem('user')){
      this.product.localAddToCart(this.productData);
      this.removeCart=true
    }else{
      let user = localStorage.getItem('user');
      let userId= user && JSON.parse(user).id;
      let cartData:cart={
        ...this.productData,
        productId:this.productData.id,
        userId
      }
      delete cartData.id;
      this.product.addToCart(cartData).subscribe((result)=>{
        if(result){
         this.product.getCartList(userId);
         this.removeCart=true
        }
      })        
    }
    
  } 
}
removeToCart(productId:number){
  if(!localStorage.getItem('user')){
this.product.removeItemFromCart(productId)
  }else{
    console.warn("cartData", this.cartData);
    
    this.cartData && this.product.removeToCart(this.cartData.id)
    .subscribe((result)=>{
      let user = localStorage.getItem('user');
      let userId= user && JSON.parse(user).id;
      this.product.getCartList(userId)
    })
  }
  this.removeCart=false
}

}
