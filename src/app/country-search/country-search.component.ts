import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, Subscription, switchMap } from 'rxjs';
import { countryInfo } from '../models/country-info';
import { CountriesService } from '../services/countries.service';

@Component({
  selector: 'app-country-search',
  templateUrl: './country-search.component.html',
  styleUrls: ['./country-search.component.less']
})
export class CountrySearchComponent implements OnInit, OnDestroy {
  countryInfo: countryInfo;
  countryList: Array<any> = [];
  term: any;
  selectedCountry: string;
  inputSubscription: Subscription;
  inputChanged: Subject<string> = new Subject<string>();
  constructor(private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.inputSubscription = this.inputChanged.pipe(
      map((value) => this.term = value), switchMap(() => this.countriesService.getCountryData(this.term))
    ).subscribe((data: any) => {
      data.map((country: any) => {
        this.countryList.push(country.name.common)
      })
    })
  }

  countrySelected(country: any) {
    this.selectedCountry = this.countryList[country];
    this.countryList = [];
    this.countriesService.getCountryData(this.selectedCountry).subscribe(data => {
      this.countryInfo = new countryInfo(data[0]);
    })
  }

  searchCountries(country: any) {
    this.inputChanged.next(country.target.value);
  }


  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }
}
