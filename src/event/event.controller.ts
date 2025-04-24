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
import { AuthGuard } from 'src/auth/auth.guard'; // Import your AuthGuard
import { CloudinaryService } from 'src/lib/cloudinary.config';

@Controller('event')
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly cloudinaryService: CloudinaryService,  // Inject CloudinaryService
    ) { }

    @Get('/get_all_events')
    async getAllEvents(): Promise<Event[]> {
        return this.eventService.getAllEvents();
    }

    @UseGuards(AuthGuard)
    @Post('/create_event')
    async createSecureServer(@Body() event: Event): Promise<Event | string> {
        if (Object.keys(event).length === 0 || !event) {
            console.log("Body is empty!");
            return 'Body is empty!';
        }
        console.log("Created an event");
        return this.eventService.createEvent(event);
    }

    @Get('/get_event_by_id/:id')
    async getEventById(@Param('id') id: number): Promise<Event> {
        return this.eventService.getEventById(id);
    }

    @UseGuards(AuthGuard)
    @Delete('/delete_event/:id')
    async deleteEvent(@Param('id') id: number): Promise<void> {
        console.log("Deleting event with id: ", id);
        return this.eventService.deleteEvent(id);
    }

    @UseGuards(AuthGuard)
    @Post('/upload')
    @UseInterceptors(FilesInterceptor('images', 5))
    async uploadEvent(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() eventData: { title: string; description: string },
    ): Promise<Event> {

        const uploadUrls: string[] = [];

        // Upload images to Cloudinary and collect the URLs
        for (const image of images) {
            const result = await this.cloudinaryService.uploadImage(image);  // Upload to Cloudinary
            uploadUrls.push(result);  // Push the URL into the array
        }

        const newEvent: Event = {
            id: 0,
            title: eventData.title,
            description: eventData.description,
            images: uploadUrls,  // Add the uploaded image URLs to the event
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return this.eventService.createEvent(newEvent);  // Save the event
    }


}
