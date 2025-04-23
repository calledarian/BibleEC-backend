import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entity/event.entity';
import { Repository } from 'typeorm';
import { throws } from 'assert';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

    ) { }
    async createEvent(event: Event): Promise<Event> {
        // Object Destucturing
        const { title, description, images, createdAt, updatedAt } = event;

        const eventToBeInserted = {
            title: title,
            description: description,
            images: images, // Assuming image is part of the event object
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        //logs to see data before saving
        console.log(eventToBeInserted)
        return this.eventRepository.save(eventToBeInserted);
    }



    async getAllEvents(): Promise<Event[]> { // Changed return type to Event[]
        return this.eventRepository.find();
    }
    async getEventById(id: number): Promise<Event> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event) {
            throw new HttpException("Event not found!", HttpStatus.NOT_FOUND)
        };
        //return the event if found
        return event;

    }

    async deleteEvent(id: number): Promise<void> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event) {
            console.log("Event not found!");
            throw new HttpException("Event not found!", HttpStatus.NOT_FOUND)
        };
        await this.eventRepository.delete(id);
        console.log("Event deleted successfully.");
    }


}

