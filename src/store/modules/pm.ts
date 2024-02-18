import { defineStore } from 'pinia';
import { BaseStore, getter, transfer } from '../base/baseStore';
import { createDecorator } from '../DI/instantiation';
import { InstantiationType, registerSingleton } from '../DI/extension';
import { readonly } from 'vue';

export const IAService = createDecorator<IAService>('IAService');
export const IBService = createDecorator<IBService>('IBService');
export const IB1Service = createDecorator<IB1Service>('IB1Service');
export const ITestService = createDecorator<ITestService>('ITestService');

/* ----------------------------------------- *
 *               A-Service
 * ----------------------------------------- */
export interface IAService {
  _serviceBrand: undefined;
  aaa: string;
}
export class AService implements IAService {
  aaa: string = 'AService';
  declare _serviceBrand: undefined;
}
/* ----------------------------------------- *
 *               B-Service
 * ----------------------------------------- */
export interface IBService {
  _serviceBrand: undefined;
  bbb: string;
}
export class BService implements IBService {
  bbb: string = 'BService';
  declare _serviceBrand: undefined;
  constructor(@IB1Service readonly b1Service: B1Service) {}
}
/* ----------------------------------------- *
 *               B-Service
 * ----------------------------------------- */
export interface IB1Service {
  _serviceBrand: undefined;
  bbb: string;
}
export class B1Service implements IB1Service {
  bbb: string = 'B1Service';
  declare _serviceBrand: undefined;
}
/* ----------------------------------------- *
 *               Test-Service
 * ----------------------------------------- */
export interface ITestService {
  _serviceBrand: undefined;
  readonly name: string;
}
export class TestService implements ITestService {
  name: string;
  declare _serviceBrand: undefined;
  constructor(
    @IAService private readonly aService: AService,
    @IBService private readonly bService: BService
  ) {
    this.name = 'TestService';
  }
}

registerSingleton(ITestService, TestService, InstantiationType.Eager);
registerSingleton(IAService, AService, InstantiationType.Eager);
registerSingleton(IBService, BService, InstantiationType.Eager);
registerSingleton(IB1Service, B1Service, InstantiationType.Eager);

@transfer
export class PluginManager extends BaseStore {
  id = 'plugin';
  constructor() {
    // @ITestService private readonly testService: ITestService
    super({
      name: 'lxy'
    });
  }

  $subManager: any;

  onStoreReady(): void {
    console.log(1);
    this.$subManager = SubManager.useStoreDeclaration();
  }

  onMount(): void {
    console.log('mounted');
  }

  @getter
  getName() {
    console.log(this);
  }

  logName() {
    console.log(this.state.name);
    // console.log(this.state.lxy)
  }
}

export class SubManager extends BaseStore {
  id = 'sub';
  constructor() {
    super({
      count: 1
    });
  }

  onStoreReady(): void {
    console.log('subManager ready');
  }

  onMount(): void {
    setInterval(() => {
      console.log(222);
      this.state.count++;
    }, 500);
  }
}
