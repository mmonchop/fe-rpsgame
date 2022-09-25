import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{path: 'fakeRoute', component: HeaderComponent}])
      ],
      declarations: [HeaderComponent],
      providers: []
    }).compileComponents();

    router = TestBed.inject(Router);

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have path and title', () => {
    component.path = '/fakeRoute'
    component.title = 'title'
    fixture.detectChanges();

    expect(component.path).toEqual('/fakeRoute')
    expect(component.title).toEqual('title')
  });

  it('should goto route', () => {
    const spy = spyOn(router, 'navigate');
    // spyOn(router, 'navigate');
    component.path = '/fakeRoute'
    component.title = 'title'
    component.goTo()
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(['/fakeRoute']);
  });
});
