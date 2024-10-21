export class CreateEventDto {
  title: string;
  description: string;
  organizer: string;
  link?: string;
  date: string;
  imagesId: string[];
  categoriesId: string[];
  totalTickets?: number;
}
