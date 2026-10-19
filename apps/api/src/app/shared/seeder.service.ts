// src/database/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan } from '../plans/schema/plan.schema'; // Adjust to your path

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    // 1. Optional: Clear existing seed data or check if it exists
    await this.planModel.deleteMany({});
    this.logger.log('Cleared existing plans.');

    // 2. Insert fresh default plans
    const defaultPlans = [
        { 
          name: "Free", 
          amount: 0, 
          interval: "yearly", 
          plan_code: "FREE_PLAN", 
          description: "Pindder's free plan is our primary package with limited possibilities", 
          features: [
              "Maximum of 10 catalog",
              "Maximum of 3 style images per catalog",
              "Maximum of 25 orders",
              "Maximum of 25 clients",
              "Maximum of 2 measurements per client",
              "Maximum of 1 withdrawal account",
              "No access to Logistic service",
              "No visibility on pindder marketplace"
          ], 
          plan_id: 0, 
          free: true, 
          recommended: false, 
        }
    ];

    await this.planModel.insertMany(defaultPlans);
    this.logger.log('Default plans seeded successfully!');
  }
}