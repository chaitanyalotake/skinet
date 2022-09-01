import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search',{static:false}) searchTerm:ElementRef

  products:IProduct[];
  brands:IBrand[];
  types:IType[];

  shopParamas=new ShopParams();
  totalCount:number;

  sortOptions=[
    {name:'Alphabetical',value:'name'},
    {name:'Price: Low to High',value:'priceAsc'},
    {name:'Price: High to Low',value:'priceDesc'}
  ]

  constructor(private shopService:ShopService) {

   }

  ngOnInit(): void {
   this.getBrands();
   this.getProducts();
   this.getTypes();
 
  
  }

  getProducts()
  {
    this.shopService.getProducts(this.shopParamas).subscribe(response=>{
      this.products=response.data;
      this.shopParamas.pageNumber=response.pageIndex;
      this.shopParamas.pageSize=response.pageSize;
      this.totalCount=response.count;
    },
    error=>{
      console.log(error);
    });
  }

  getBrands()
  {
    this.shopService.getBrands().subscribe(response=>{
      this.brands=[{id:0,name:'All'}, ...response];
    },
    error=>{
      console.log(error);
    });
  }

  getTypes()
  {
    this.shopService.getTypes().subscribe(response=>{
      this.types=[{id:0,name:'All'}, ...response];
    },
    error=>{
      console.log(error);
    });
  }

  onBrandSelected(brandId:number)
  {
    this.shopParamas.brandId=brandId;
    this.shopParamas.pageNumber=1;
    this.getProducts();
  }

  onTypeSelected(typeId:number)
  {
    this.shopParamas.typeId=typeId;
    this.shopParamas.pageNumber=1;
    this.getProducts();
  }

  onSortSelected(sort:string)
  {
    this.shopParamas.sort=sort;
    this.getProducts();
  }

  onPageChanged(event:any)
  {
    if(this.shopParamas.pageNumber!==event)
    {
    this.shopParamas.pageNumber=event;
    this.getProducts();
    }
  }

  onSearch()
  {
    this.shopParamas.search=this.searchTerm.nativeElement.value;
    this.shopParamas.pageNumber=1;
    this.getProducts();
  }
  onReset()
  {
    this.searchTerm.nativeElement.value='';
    this.shopParamas=new ShopParams();
    this.getProducts();
  }
}
