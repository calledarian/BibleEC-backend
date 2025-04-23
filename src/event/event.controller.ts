import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Event } from 'src/entity/event.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard'; // Import your AuthGuard


@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Get('/get_all_events')
    async getAllEvents(): Promise<Event[]> {
        return this.eventService.getAllEvents();
    }


    @UseGuards(AuthGuard)
    @Post('/create_event')
    async createSecureServer(@Body() event: Event): Promise<Event | string> {
        if (Object.keys(event).length === 0 || !event) {
            console.log("Body is empty!")
            return 'Body is empty!';
        }
        console.log("created an event")
        return this.eventService.createEvent(event);

    }

    @Get('/get_event_by_id/:id')
    async getEventById(@Param('id') id: number): Promise<Event> {
        return this.eventService.getEventById(id);
    }

    @UseGuards(AuthGuard)
    @Delete('/delete_event/:id')
    async deleteEvent(@Param('id') id: number): Promise<void> {
        console.log("Deleting event with id: ", id)
        return this.eventService.deleteEvent(id);
    }

    @UseGuards(AuthGuard)
    @Post('/upload')
    @UseInterceptors(
        FilesInterceptor('images', 5, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(5)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, randomName + extname(file.originalname));
                },
            }),
        }),
    )
    async uploadEvent(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() eventData: { title: string; description: string },
    ): Promise<Event> {

        const imagePaths = images.map((img) => img.filename);

        const newEvent: Event = {
            id: 0,
            title: eventData.title,
            description: eventData.description,
            images: imagePaths,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return this.eventService.createEvent(newEvent);
    }
}
