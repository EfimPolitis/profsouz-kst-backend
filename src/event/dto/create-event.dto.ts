export class CreateEventDto {
  title: string;
  description: string;
  organizer: string;
  link?: string;
  eventDate: string;
  imagesId: string[];
  categoriesId: string[];
  totalTickets?: number;
}
