import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuctionService } from '../services/auction.service';
import { AuthService } from '../services/auth.service';
import { Bid } from '../models/Bid';
import { Property } from '../models/Property';
import { ViewPropertyService } from '../services/viewProperty.service';

declare var $: any;

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit, OnDestroy {

  private bidData: any;
  private bids: any;
  private currentUser: any;
  private connection: any;
  private deadline: any;
  private newBid: any;
  private property: any;
  private propertyId: any;
  private timeInterval: any;
  private timer: any;
  private userType: string;

  private days: any;
  private hours: any;
  private minutes: any;
  private seconds: any;
  private interval: any;

  constructor(private activatedRoute: ActivatedRoute,
              private auctionService: AuctionService,
              private authService: AuthService,
              private router: Router,
              private viewPropertyService: ViewPropertyService) { }

  ngOnInit() {

    // GET CURRENT USER INFO
    this.userType = this.authService.loggedInUserType();

    this.authService.getCurrentUser()
      .subscribe((response) => {
        this.currentUser = response.data;
      })

    // GET PROPERTY
    if (!this.auctionService.propertyExists) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.propertyId = params['id'];
        this.viewPropertyService.getPropertyById(this.propertyId)
          .subscribe((response) => {
            this.property = response;
          }, (error) => {
            this.router.navigate(['/dashboard']);
          })

      });
    } else {
      this.auctionService.getProperty()
        .subscribe((response) => {
          this.property = response;
          this.propertyId = this.property._id;
          this.bids = this.auctionService.getBidData();
        }, (error) => {

        });
    }

    this.auctionService.getInitialBids(this.propertyId)
      .subscribe((response) => {
        this.bids = response.data.bids;
        this.deadline = response.data.deadline;
        this.establishCountdownTimer();
      }, (error) => {
        this.router.navigate(['/dashboard']);
      })

    // GET BIDS
    // listens for new-bid in auctionService and pushes to this.bids
    this.connection = this.auctionService.getBids()
      .subscribe((bid) => {
        this.bids.push(bid.data);
      })

    this.newBid = {
      amount: ''
    };

  }

  addBidModal() {
    $("#addBidModal").modal('show');
  }

  addBid() {
    this.newBid.amount = this.newBid.amount.replace(',', '');
    this.newBid.amount = this.newBid.amount.replace('$', '');
    this.auctionService.sendBid(this.property._id, this.currentUser, this.newBid.amount);
    $("#addBidModal").modal('hide');
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  establishCountdownTimer() {
    this.interval = setInterval(this.setTimer.bind(this), 1000);
  }

  setTimer() {
    let now = new Date().getTime();
    let t = new Date(this.deadline).getTime() - now;
    this.days = Math.floor(t / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60 * 60));
    this.minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((t % (1000 * 60)) / 1000);
  }

}
