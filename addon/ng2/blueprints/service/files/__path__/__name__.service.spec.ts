/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { <%= classifiedModuleName %>Service } from './<%= dasherizedModuleName %>.service';

describe('Service: <%= classifiedModuleName %>', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [<%= classifiedModuleName %>Service]});
  });

  let <%= camelizedModuleName %>;
  beforeEach(inject([<%= classifiedModuleName %>Service], (<%= camelizedModuleName %>Service: <%= classifiedModuleName %>Service) => {
    <%= camelizedModuleName %> = <%= camelizedModuleName %>Service;
  }));

  it('should ...', () => {
    expect(<%= camelizedModuleName %>).toBeTruthy();
  });
});
