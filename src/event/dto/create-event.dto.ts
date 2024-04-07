export class CreateEventDto {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  date: string;
  categoriesId: string[];
  totalTickets?: number;
}
