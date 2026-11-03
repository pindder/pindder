import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { Banner } from '../../components/banner/banner';
import { Pricing } from '../../components/pricing/pricing';
import { Guide } from '../../components/guide/guide';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Hero, Features, Banner, Pricing, Guide],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
