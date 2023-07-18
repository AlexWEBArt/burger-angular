import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { AppService } from './app.service';

export type Data = {
  image: string;
  title: string;
  text: string;
  price: number;
  basePrice: number;
  grams: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  currency = '$';
  loaderShowed = true;
  loader = true;

  orderImageStyle: any;
  mainImageStyle: any;

  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  });

  productsData: Data[] = [];

  constructor(private fb: FormBuilder, private appService: AppService) {
  };

  @HostListener('document: mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.orderImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3)/8) + 'px,-' + ((e.clientY * 0.3)/8) + 'px)'}
    this.mainImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3)/8) + 'px,-' + ((e.clientY * 0.3)/8) + 'px)'}
  }

  ngOnInit() {
    setTimeout(() => {
      this.loaderShowed = false;
    }, 3000)
    setTimeout(() => {
      this.loader = false;
    }, 4000)
    this.appService.getData().subscribe((data: Data[]) => {
      data.forEach((product: Data) => this.productsData.push(product));
    });
  }

  scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({ behavior: 'smooth' });

    if (burger) {
      this.form.patchValue({ order: burger.title + ' (' + burger.price + ' ' + this.currency + ')' });
    }
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response) => {
            alert(response.error.message);
          },
        })
    }
  }

  changeCurrency() {
    let newCurrency = '$';
    let coefficient = 1;

    if (this.currency === '$') {
      newCurrency = '₽';
      coefficient = 90;
    } else if (this.currency === '₽') {
      newCurrency = '₸';
      coefficient = 440;
    } else if (this.currency === '₸') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }

    this.currency = newCurrency;

    this.productsData.forEach(product=> {
      product.price = +(product.basePrice * coefficient).toFixed(1);
    })

  }
}