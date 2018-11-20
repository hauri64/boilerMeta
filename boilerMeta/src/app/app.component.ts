import { Component, HostListener } from '@angular/core';
import { ERC20Service } from './erc20.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  ethbalance: any;
  erc20balance: any;
  address: any;
  isWalletInstalled: boolean;
  isUnlocked: boolean;
  isRobsten: boolean;

  constructor(public erc20service: ERC20Service) {}

  @HostListener('window:load')
  async hostLoaded() {
    this.isWalletInstalled = this.erc20service.isWalletInstalled();
    if (!this.isWalletInstalled) {
      return;
    }
    this.erc20service.setTokenAddress('0x3c83116b6f5dd133caa985d70c6e84f092d3a4b6');
    this.erc20service.connect();
    this.erc20service.readyEvent().subscribe(async o => {
      this.isUnlocked = this.erc20service.isUnlocked();
      if (!this.isUnlocked) {
        return;
      }
      this.isRobsten = await this.erc20service.isRobsten();
      this.address = this.erc20service.getPrimaryAccount();
      this.ethbalance = await this.erc20service.getETHBalance(this.address);
      this.erc20balance = await this.erc20service.getTokenBalance(this.address);
    });
  }


  public async trans() {
    const o = await this.erc20service.transfer('0xfc50098F9491e09D96877C034f6a3F3Ee4aFF3aE', '10');
    console.log(o);
  }
}
