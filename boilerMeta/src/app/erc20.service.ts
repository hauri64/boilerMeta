import { Injectable, EventEmitter  } from '@angular/core';
import * as erc20Interface from './ERC20.json';
import { TouchSequence } from 'selenium-webdriver';


@Injectable()
export class ERC20Service {

  private tokenAddress: string;
  private web3: any;
  private primaryAccount: string;
  private ready: EventEmitter<any> = new EventEmitter();

  private rdy: boolean;
  public isReady() {
    return this.rdy;
  }

  public readyEvent():  EventEmitter<any> {
    return this.ready;
  }

  public setTokenAddress(tkn: string) {
    this.tokenAddress = tkn;
  }

  public async transfer(to: string, amount: string) {
    const acc = await this.getPrimaryAccount();
    const amountWei = this.web3.toWei(amount);
    return  await new Promise<number>(async (resolve, reject) => {
      const instance = await this.fetchContractInstance(this.tokenAddress, erc20Interface);
      instance.transfer(to,  amountWei, { gas: 500000, from: acc },
      (e, res) => {
          if (e) { reject(e); }
          resolve(res);
      });
  });
  }

  public async getTokenBalance( acc: string): Promise<number> {
    return await new Promise<number>(async (resolve, reject) => {
      const instance = await this.fetchContractInstance(this.tokenAddress, erc20Interface);
      instance.balanceOf(acc, (e, res) => {
        if (e) { reject(e); }
        resolve(this.web3.fromWei(res).toNumber());
      });
    });
  }

  public getETHBalance(acc: string) {
    return new Promise((resolve, reject) => {
        this.web3.eth.getBalance(acc, ( e, o) => {
          const value = this.web3.fromWei(o);
          return resolve(value);
         });
    });
  }

  public getPrimaryAccount(): string {
    return this.primaryAccount;
  }

  public isUnlocked() {
    return this.web3.eth.accounts.length > 0;
  }


  public isRobsten(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
        if (netId - 3  === 0) {
          resolve(true);
        } else {
           resolve(false);
        }
      });
    });
  }

  public isWalletInstalled() {
    return !!window['web3js'];
  }

  public connect() {
    this.web3 = window['web3js'];
    this.getAccount().then(acc => {
      this.primaryAccount = <string> acc;
      this.ready.emit();
      this.rdy = true;
    });
  }

  private getAccount() {

    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(( e, o) => {
        return resolve(o[0]);
       });
    });
  }

  private fetchContractInstance(contractAddress: any, ctr: any) {
    const ctrct = this.web3.eth.contract(ctr.abi);
    const sampleContractInstance = ctrct.at(contractAddress);
    return sampleContractInstance;
  }

}
