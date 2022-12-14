import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { CheckoutService } from '../checkout.service';
import { IOrder } from '../../shared/models/order';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {

  @Input() checkOutForm: FormGroup;
  constructor(private basketService: BasketService, private checkoutService: CheckoutService, 
    private toastr: ToastrService, private router:Router
    ) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully');
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras:NavigationExtras={state:order}
      console.log(order);
      
      this.router.navigate(['checkout/success'],navigationExtras);

    },
      error => {
        this.toastr.error(error.message);
        console.log(error);

      });
  }

  private getOrderToCreate(basket: IBasket) {

    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkOutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkOutForm.get('addressForm').value
    }
  }

}
