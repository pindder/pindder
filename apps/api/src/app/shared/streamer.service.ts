import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { filter, map, Observable, Subject } from 'rxjs';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { Model } from 'mongoose';

@Injectable()
export class StreamerService {
    private logger = new Logger(StreamerService.name);

    private balanceUpdate$ = new Subject<{ userId: string; newBalance: number }>();
    private balanceUpdateStream: any;

    constructor(
        @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>
    ) {}

    // 1. Start watching the database as soon as NestJS boots up
    onModuleInit() {
        // -----WATCHER 1: Tailor Collection-----------
        // fullDocument: 'updateLookup' ensures we get the latest document state after an update
        this.balanceUpdateStream = this.tailorModel.watch([], { fullDocument: 'updateLookup' });
        this.balanceUpdateStream.on('change', (change: any) => {
            // Check if the change is an update operation on a user document
            if (change.operationType === 'update') {
                const updatedFields = change.updateDescription?.updatedFields;
                
                // Verify if the balance field was specifically modified
                if (updatedFields && 'currentBalance' in updatedFields) {
                    const userId = change.documentKey._id.toString();
                    const newBalance = change.fullDocument.currentBalance;

                    // Push the update into our internal RxJS stream
                    this.balanceUpdate$.next({ userId, newBalance });
                }
            }
        });

        this.balanceUpdateStream.on('error', (error: any) => {
            this.logger.error('Balance_Update: MongoDB Change Stream error', error);
        });
    }

    // 2. Clean up the connection gracefully when the app shuts down
    async onModuleDestroy() {
        if (this.balanceUpdateStream) {
        await this.balanceUpdateStream.close();
        }
    }

    // Stream generator filtered by user ID
    streamUserBalance(userId: string): Observable<MessageEvent> {
        return this.balanceUpdate$.asObservable().pipe(
            filter((event) => event.userId === userId),
            map((event) => ({
                data: { newBalance: event.newBalance }
            } as MessageEvent))
        );
    }
}
